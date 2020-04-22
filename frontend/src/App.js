import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import "./App.css";
import { Button, Card, Layout, List, notification } from "antd";
import Cart from "./components/Cart";
import GithubLogo from "./GitHub-Mark-Light-64px.png";

const { Content, Footer, Header, Sider } = Layout;
const { Item } = List;
const { Meta } = Card;

const PageHeader = styled.h1`
  color: white;
  font-size: 3em;
  padding-top: 0.2em;
  font-weight: 700;
`;

const Price = styled.span`
  color: black;
  font-weight: 600;
  font-size: 1.25em;
  line-height: 2.25em;
`;
/**
 * App
 * 
 * The core component of our shopping cart application.
 */
class App extends Component {
  state = {
    cartId: 0,
    cartList: [],
    cartTaxes: 0,
    cartTotal: 0,
    productList: [],
    visible: false,
  };

  /**
   * Add a product to the cart when the button is clicked.
   *
   * @param object e The event from the click.
   * @return void
   */
  addToCart = async (e) => {
    const productId = e.target.getAttribute("id");
    if (this.state.cartId) {
      const response = await axios.post(
        `http://localhost:3100/carts/${this.state.cartId}`,
        { data: { product_id: productId } }
      );
      const body = response.data;
      if (response.status !== 201) {
        notification.error({
          message: "Error, the selected item could not be added to your cart.",
          description: body.message,
        });
      } else {
        this.getCartList();
        notification.success({
          message: "Item added to your cart!",
          description: body.message,
        });

      }
    }
  };

  /**
   * Convert strings formatted as MONEY to number.
   *
   * @param string moneyString The string to convert.
   * @return Integer
   */
  convertMoneyToInt = (string) => {
    if (!string) {
      return 0;
    }
    return parseInt(string.replace(/[^0-9.-]+/g, ""));
  };

  /**
   * Convert strings formatted as MONEY to number.
   *
   * @param integer input The int to convert.
   * @return Integer
   */
  convertToMoney = (input) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
    return formatter.format(input);
  };

  createCart = async () => {
    const response = await axios.post("http://localhost:3100/carts");
    const body = response.data;
    if (response.status !== 201) {
      throw Error(body.message);
    }
    this.setState({
      cartID: body[0].id,
    });
    // Persist the cartId in the client with local storage.
    localStorage.setItem("cartId", body[0].id);
  };

  getCartList = async () => {
    let cartList = [];
    const cartId = localStorage.getItem("cartId");
    if (cartId) {
      const response = await axios.get(`http://localhost:3100/carts/${cartId}`);
      const body = response.data;
      if (response.status !== 200) {
        throw Error(body.message);
      }
      const productAggregate = body.reduce(function (results, item) {
        (results[item.id] = results[item.id] || []).push(item);
        return results;
      }, {});
      Object.keys(productAggregate).forEach((item) => {
        let listItem = {};
        listItem.id = item;
        let price = this.convertMoneyToInt(productAggregate[item][0].price);
        listItem.name = productAggregate[item][0].name;
        listItem.quantity = productAggregate[item].length;
        let totalPrice = price * listItem.quantity;
        listItem.price = this.convertToMoney(totalPrice);
        cartList.push(listItem);
      });
      if (cartList.length > 0) {
        const cartSubtotal = cartList.reduce(
          (prev, cur) => prev + this.convertMoneyToInt(cur.price),
          0
        );
        const cartTaxes = cartSubtotal * 0.0825;
        const cartTotal = cartSubtotal + cartTaxes;
        this.setState({
          cartTaxes,
          cartTotal,
          cartList,
        });
      }
    }
  };

  getProductList = async () => {
    const response = await axios.get("http://localhost:3100/products");
    const body = response.data;
    if (response.status !== 200) {
      throw Error(body.message);
    }
    this.setState({
      productList: body,
    });
  };

  getProductById = async (id) => {
    const response = await axios.get(`http://localhost:3100/products/${id}`);
    const body = response.data;
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  handleClose = (e) => {
    this.setState({
      visible: false,
    });
  };

  /**
   * Check to see if the product is already in the cart.
   *
   * @param integer productId The id of the product we're looking for.
   * @return boolean
   */
  productInCart = (productId) => {
    if (productId) {
      const containsProduct = this.state.cartList.find((item) => {
        // console.log(item.id);
        // console.log(productId);
        return parseInt(item.id) === parseInt(productId);
      });

      if (containsProduct) {
        return true;
      } else {
        return false;
      }
    }
  };

  componentDidMount() {
    const cartId = localStorage.getItem("cartId");
    if (cartId !== 0) {
      this.setState({
        cartId: cartId,
      });
    }
    this.getProductList();
  }

  render() {
    const { cartId, cartList, cartTotal, cartTaxes, productList } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header className="shop-header">
          <PageHeader>Simple Shop</PageHeader>
        </Header>
        <Layout>
          <Content className="shop-list-container">
            <List
              className="shop-list"
              grid={{
                gutter: [24, 40],
                sm: 1,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 3,
              }}
              dataSource={productList}
              size="large"
              split={true}
              renderItem={(item) => {
                return (
                  <Item>
                    <Card
                      hoverable
                      style={{ width: "100%" }}
                      cover={<img alt="example" src={item.image_url} />}
                      actions={[
                        <Price>{item.price}</Price>,
                        <Button
                          size="large"
                          type="primary"
                          id={item.id}
                          onClick={this.addToCart}
                          disabled={this.productInCart(item.id)}
                        >
                          Add to Cart
                        </Button>,
                      ]}
                    >
                      <Meta title={item.name} description={item.description} />
                    </Card>
                  </Item>
                );
              }}
            />
          </Content>
          <Sider
            width={450}
            height="82vh"
            style={{
              padding: "2em",
              backgroundColor: "rgb(236, 236, 236)",
            }}
            breakpoint="lg"
            collapseWidth="0"
            className="shop-sider"
          >
            <Cart
              cartId={cartId}
              cartList={cartList}
              cartTaxes={cartTaxes}
              cartTotal={cartTotal}
              createCart={this.createCart}
              getCartList={this.getCartList}
              convertToMoney={this.convertToMoney}
              updateCartQuantity={this.updateCartQuantity}
            />
          </Sider>
        </Layout>
        <Footer className="app-footer">
          <a href="https://github.com/hughdevore/simple-shop">
            <img
              src={GithubLogo}
              className="github-logo"
              alt="GitHub Logo with link to repository"
            />
          </a>
        </Footer>
      </Layout>
    );
  }
}
export default App;
