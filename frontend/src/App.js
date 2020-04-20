import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import './App.css';
import {
  Button,
  Card,
  Layout,
  List,
  notification,
  Popconfirm,
} from 'antd';
import Cart from './components/Cart';
import { DeleteOutlined, EditOutlined, SettingOutlined, EllipsisOutlined } from '@ant-design/icons';
import GithubLogo from './GitHub-Mark-Light-64px.png';

const { Content, Footer, Header, Sider } = Layout;
const { Item } = List;
const { Meta } = Card;

const PageHeader = styled.h1`
  color: white;
  font-size: 3em;
  padding-top: .2em;
  font-weight: 700;
`;

const Price = styled.span`
  color: black;
  font-weight: 600;
  font-size: 1.25em;
  line-height: 2.25em;
`;

class App extends Component {
  state = {
    cartId: 0,
    cartList: [],
    productList: [],
    visible: false,
  };

  createCart = async () => {
    const response = await axios.post('http://localhost:3100/carts');
    const body = response.data;
    if (response.status !== 201) {
      throw Error(body.message);
    }
    this.setState({ 
      cartID: body[0].id,
    });
    // Persist the cartId in the client with local storage
    localStorage.setItem('cartId', body[0].id);
  }

  getCartList = async () => {
    let cartListBeta = [];
    let cartList = [];
    const cartId = localStorage.getItem('cartId');
    const response = await axios.get(`http://localhost:3100/carts/${cartId}`);
    const body = response.data;
    if (response.status !== 200) {
      throw Error(body.message);
    }
    const productAggregate = body.reduce(function(results, item) {
      (results[item.product_id] = results[item.product_id] || []).push(item);
      return results;
    }, {});
    Object.keys(productAggregate).forEach(item => {
      let listItem = {};
      listItem.id = item;
      listItem.quantity = productAggregate[item].length;
      cartListBeta.push(listItem);
    });
    cartList = cartListBeta.map(async item => {
      await this.getProductById(item.id)
      .then(product => {
        item.price = product[0].price;
        item.name = product[0].name;
        return item;
      });
    });
    if (cartList) {
      this.setState({ 
        cartList: cartList,
      });
    }
  }

  getProductList = async () => {
    const response = await axios.get('http://localhost:3100/products');
    const body = response.data;
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    this.setState({ 
      productList: body,
    });
  }

  getProductById = async (id) => {
    const response = await axios.get(`http://localhost:3100/products/${id}`);
    const body = response.data;
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  addToCart = async (e) => {
    const productId = e.target.getAttribute('id');
    const response = await axios.post(`http://localhost:3100/carts/${this.state.cartId}`, {product_id: productId});
    const body = response.data;
    if (response.status !== 201) {
      notification.error({
        message: 'Error, the selected item could not be added to your cart.',
        description: body.message,
      });
    } else {
      notification.success({
        message: 'Item added to your cart!',
        description: body.message,
      });
      this.getCartList();
    }
  }

  // TODO: Remove Product from Cart

  // deleteArt = async (id) => {
  //   console.log(id);
  //   const response = await axios.delete(`http://localhost:3100/art/${id}`);
  //   const body = response.data;
  //   if (response.status !== 200) {
  //     notification.error({
  //       message: 'Error, your art could not be deleted.',
  //       description: body.message,
  //     });
  //   } else {
  //     notification.success({
  //       message: 'Your art was deleted from sthe manager!',
  //       description: body.message,
  //     });
  //     this.getArtList();
  //   }
  // }

  // TODO: Add Cart button in header and use drawer for cart
  showDrawer = () => {
    this.setState({visible: true});
  };

  handleClose = e => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount() {
    const cartId = localStorage.getItem('cartId');
    if (cartId !== 0) {
      this.setState({
        cartId: cartId
      });
    }
    this.getProductList();
    this.getCartList();
  }

  render() {
    const { productList } = this.state;    
    return (
      <Layout style={{minHeight: '100vh' }}>
        <Header className="shop-header">
          <PageHeader>Simple Shop</PageHeader>
        </Header>
        <Layout>
          <Content
            className="shop-list-container"
          >
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
              renderItem={item => {   
                return (
                  <Item>
                    <Card
                      hoverable
                      style={{ width: '100%'}}
                      onClick={this.addToCart}
                      cover={
                        <img
                          alt="example"
                          src={item.image_url}
                        />
                      }
                      actions={[
                        <Price>{item.price}</Price>,
                        <Button size="large" type="primary" id={item.id}>Add to Cart</Button>,
                      ]}
                    >
                      <Meta
                        title={item.name}
                        description={item.description}
                      />
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
              padding: '2em',
              backgroundColor: 'rgb(236, 236, 236)',
            }}
            breakpoint="lg"
            collapseWidth="0"
            className="shop-sider"
          >
            <Cart cartId={this.state.cartId} cartList={this.state.cartList} getCartList={this.getCartList}/>
          </Sider>
        </Layout>
        <Footer className="app-footer">
          <a href="https://github.com/hughdevore/simple-shop">
            <img src={GithubLogo} className="github-logo" alt="GitHub Logo with link to repository"/>
          </a>
        </Footer>
      </Layout>
    );
  }
}
export default App;