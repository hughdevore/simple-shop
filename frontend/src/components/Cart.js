import React, { Component, Fragment } from "react";
import axios from "axios";
import styled from "styled-components";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Empty, List, Modal, Select } from "antd";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

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
  border-bottom: 1px solid rgb(82, 82, 82);
  font-size: 2em;
  text-align: left;
  color: black;
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

const Total = styled.span`
  color: black;
`;

const TotalContainer = styled.span`
  width: 100%;
  display: inline-block;
  padding: 0.25em 0;
  font-size: 1.5em;
  border-top: 1px solid rgb(82, 82, 82);
  border-bottom: 1px solid rgb(82, 82, 82);
`;

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

class Cart extends Component {
  state = {
    cartSubtotal: 100,
    cartTaxes: 0,
    cartTotal: 0,
    visible: false,
  };

  handleChange = (value) => {
    console.log(`selected ${value}`);

    // TODO: Update cart quantity on change
  };

  hideModal = () => {
    const cartId = localStorage.getItem("cartId");
    console.log(cartId);
    this.setState({
      visible: false,
    });
    if (!cartId || cartId === 0) {
      this.props.createCart();
    }
  };

  cartQuantity = (quantity) => {
    return (
      <Select defaultValue={quantity} onChange={this.handleChange}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
      </Select>
    );
  };

  componentDidMount() {
    const cartId = localStorage.getItem("cartId");
    if (cartId === 0) {
      this.setState({
        visible: true,
      });
    } else {
      this.props.getCartList();
    }
  }

  render() {
    const { cartTaxes, cartTotal, visible } = this.state;
    const { cartList, getCartList } = this.props;
    console.log(cartList);
    return (
      <div>
        <CartHeader>Cart Summary</CartHeader>
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
            const { name, price, quantity } = item;
            return (
              <List.Item
                actions={[
                  <Price>{price}</Price>,
                  this.cartQuantity(quantity),
                ]}
              >
                <List.Item.Meta title={name} />
              </List.Item>
            );
          }}
        />
        <TaxesContainer>
          <span>Taxes</span>
          <TaxesAmount>{formatter.format(cartTaxes)}</TaxesAmount>
        </TaxesContainer>
        <TotalContainer>
          <Total>Cart Total</Total>
          <TotalAmount>{formatter.format(cartTotal)}</TotalAmount>
        </TotalContainer>
        <div style={{ padding: "3em", textAlign: "center" }}>
          <Button
            size="large"
            type="primary"
            style={{
              backgroundColor: "green",
              fontSize: "2em",
              height: "2.25em",
              border: "none",
            }}
          >
            Checkout
          </Button>
        </div>
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
