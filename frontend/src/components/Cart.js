import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Empty, InputNumber, List, Modal, notification } from "antd";

const TaxesAmount = styled.span`
  color: black;
  font-weight: 600;
  font-size: 1em;
  float: right;
  margin-right: 4.15em;
`;

const TotalAmount = styled.span`
  color: black;
  font-weight: 600;
  font-size: 1em;
  float: right;
  margin-right: 3.25em;
`;

const CartHeader = styled.h1`
  font-size: 2.5em;
  text-align: left;
  color: black;
  display: inline-block;
  margin-bottom: 0;
`;

const CartHeaderCount = styled.span`
  float: right;
  font-size: 1em;
  padding-top: 2em;
`;

const CheckoutContainer = styled.div`
  padding: 3em;
  text-align: right; 
`;

const Price = styled.span`
  color: black;
  font-weight: 600;
  font-size: 1em;
  width: 100px;
`;

const TaxesContainer = styled.span`
  width: 100%;
  display: inline-block;
  padding-top: 1em;
  padding-bottom: 0.5em;
  font-size: 1.25em;
`;

const TotalContainer = styled.span`
  width: 100%;
  display: inline-block;
  padding: 0.25em 0;
  font-size: 1.5em;
  border-top: 1px solid rgb(82, 82, 82);
  border-bottom: 1px solid rgb(82, 82, 82);
`;

/**
 * Cart
 * 
 * The Cart component contains the cart list, product quantities and 
 * their functionality for updating/removing.
 */
class Cart extends Component {
  state = {
    visible: false,
    productId: 0,
  };

  /**
   * Convert strings formatted as MONEY to number.
   *
   * @param integer input The int to convert.
   * @return string
   */
  convertToMoney = (input) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
    return formatter.format(input);
  };

  /**
   * Get the product ID from the label in the quantity select field.
   *
   * @param string label The label from the select field.
   * @return integer
   */
  parseProductIdFromLabel = (label) => {
    const regex = /\d+(?=-)/gm;
    let match = regex.exec(label);
    return parseInt(match[0]);
  };

  /**
   * Update the current cart's product quantities over REST.
   *
   * @param int value The int value from the quantity selector.
   * @return void
   */
  updateCartQuantity = async (value, id) => {
    // Don't update the value if it's an empty input.
    if (value === '') {
      return;
    }
    const { cartList, cartId } = this.props;
    if (cartList) {
      const productId = parseInt(id);
      const cartProduct = cartList.find((item) => {
        return parseInt(item.id) === productId;
      });

      if (cartProduct) {
        if (value > cartProduct.quantity) {
          const quantityToAdd = (value - cartProduct.quantity);
          // Make a request to add the extra quantity of this product.
          const response = await axios.post(
            `http://localhost:3100/carts/${cartId}`,
            { data: { product_id: productId, quantity: quantityToAdd } }
          );
          const body = response.data;
          console.log(response);
          if (response.status !== 201) {
            notification.error({
              message: "Error, your cart item quantity could not be updated.",
              description: body.message,
            });
          } else {
            notification.success({
              message: "Your cart has been updated!",
              description: body.message,
            });
            this.props.getCartList();
          }
        }
        
        if (value < cartProduct.quantity) {
          let quantityRemaining = 0;
          // Get the quantity remaining.
          if(value !== 0) {
            const reducedBy = (value - cartProduct.quantity);
            quantityRemaining = cartProduct.quantity + reducedBy;
          }

          // Make request to delete the extra quantity of this product.
          const response = await axios.delete(
            `http://localhost:3100/carts/${cartId}`,
            { data: { product_id: productId, quantity: quantityRemaining } }
          );
          const body = response.data;
          if (response.status !== 200) {
            notification.error({
              message: "Error, your cart item quantity could not be updated.",
              description: body.message,
            });
          } else {
            notification.success({
              message: "Your cart has been updated!",
              description: body.message,
            });
            this.props.getCartList();
          }
        }
      }
    }
  };

  /**
   * Hide the empty cart modal upon closing.
   * 
   * @return void
   */
  hideModal = () => {
    const cartId = localStorage.getItem("cartId");
    if (!cartId || cartId === 0) {
      this.props.createCart();
    } else {
      const cartExists = axios.get(`http://localhost:3100/carts/${cartId}`);
      console.log(cartExists);
    }

    this.setState({
      visible: false,
    });
  };

  componentDidMount() {
    const cartId = localStorage.getItem("cartId");
    const { getCartList } = this.props;
    if (cartId === 0 || cartId === null) {
      this.setState({
        visible: true,
      });
    } else {
      getCartList();
    }
  }

  render() {
    const { visible } = this.state;
    const { cartTaxes, cartTotal, cartList } = this.props;

    return (
      <div style={{padding: '2em'}}>
        <div
          style={{borderBottom: '1px solid rgb(82, 82, 82)'}}
        >
          <CartHeader>Cart Summary</CartHeader>
          <CartHeaderCount>
            {`${cartList && cartList.length ? cartList.length : 0} products in your cart`}
          </CartHeaderCount>
        </div>
        <List
          locale={{
            emptyText: (
              <Empty
                image={<ShoppingCartOutlined />}
                style={{
                  fontSize: "7em",
                }}
                description={
                  <span style={{ fontSize: "18px" }}>
                    Add items to your cart!
                  </span>
                }
              />
            ),
          }}
          itemLayout="horizontal"
          dataSource={cartList}
          renderItem={(item) => {
            const { id, name, price, quantity } = item;
            return (
              <List.Item
                actions={[
                  <Price>{price}</Price>,
                  <InputNumber
                    max={3}
                    key={id}
                    defaultValue={quantity}
                    onChange={(value) => this.updateCartQuantity(value, id)}
                    size="small"
                  />
                ]}
              >
                <List.Item.Meta title={name} />
              </List.Item>
            );
          }}
        />
        <TaxesContainer>
          <span>Taxes</span>
          <TaxesAmount>{this.convertToMoney(cartTaxes)}</TaxesAmount>
        </TaxesContainer>
        <TotalContainer>
          <span style={{color: 'black'}}>Cart Total</span>
          <TotalAmount>{this.convertToMoney(cartTotal)}</TotalAmount>
        </TotalContainer>
        <CheckoutContainer>
          <Button
            size="large"
            type="primary"
            className="checkout-button"
          >
            Checkout
          </Button>
        </CheckoutContainer>
        <Modal
          title="Welcome to Simple Shop"
          visible={visible}
          maskClosable={true}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          footer={null}
        >
          Add items to your cart to get started!
        </Modal>
      </div>
    );
  }
}

export default Cart;
