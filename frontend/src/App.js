import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import moment from 'moment';
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

class App extends Component {
  state = {
    initLoading: true,
    list: [],
    loading: false,
    visible: false,
    updateArt: {
      id: null,
      description: null,
      name: null,
    }
  };

  componentDidMount() {
    this.getProductList();
  }

  getProductList = async () => {
    const response = await axios.get('http://localhost:3100/products');
    const body = response.data;
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    this.setState({ 
      list: body,
    });
  }

  // TODO: Add Product to Cart (+ buttton)

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

  render() {
    const { list, updateArt } = this.state;
    return (
      <Layout style={{minHeight: '100vh' }}>
        <Header className="art-manager-header">
          <h1>Simple Shop</h1>
        </Header>
        <Layout>
          <Content
            className="shop-list-container"
          >
            <List 
              className="shop-list"
              grid={{
                gutter: 20,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 3,
              }}
              dataSource={list}
              size="large"
              split={true}
              renderItem={item => {                
                return (
                  // <Item
                  //   key={item.id}
                  //   avatar={(<img src={item.image_url} />)}
                  //   extra={[
                  //     <Button size="small" onClick={() =>{
                  //       this.setState({
                  //         updateArt: {
                  //           id: item.id,
                  //           description: item.description,
                  //           name: item.name,
                  //         }
                  //       });
                  //       this.showDrawer();
                  //     }}>Quantity</Button>,
                  //     <Popconfirm
                  //       placement="topRight"
                  //       title="Are you sure you want to remove this from your cart?"
                  //       okText="Yes"
                  //       cancelText="No"
                  //       onConfirm={() => {this.deleteArt(item.id)}}
                  //     >
                  //       <DeleteOutlined 
                  //         style={{paddingLeft: '2em'}}
                  //         twoToneColor="black"
                  //       />
                  //     </Popconfirm>
                  //   ]}
                  //   actions={[
                  //     <span><strong>Artist: </strong>{item.artist}</span>,
                  //     <span><strong>Height: </strong>{item.width}</span>,
                  //     <span><strong>Width: </strong>{item.width}</span>,
                  //   ]}
                  // >
                  //   <Item.Meta
                  //     key={`item-${item.id}`}
                  //     title={item.name}
                  //     description={moment.utc(item.date).format("ll")}
                  //   />
                  //   {item.description}
                  // </Item>
                  <Item>
                    <Card
                      style={{ width: 300 }}
                      cover={
                        <img
                          alt="example"
                          src={item.image_url}
                        />
                      }
                      actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                      ]}
                    >
                      <Meta
                        title={item.title}
                        description={item.description}
                      />
                    </Card>
                  </Item>
                );
              }}
            />
          </Content>
          <Sider
            width={350}
            style={{
              padding: '2em',
              backgroundColor: 'rgb(236, 236, 236)',
            }}
            breakpoint="lg"
            collapseWidth="0"
          >
            <h2 className="update-art-form-header">Cart Summary</h2>
            <Cart />
          </Sider>
        </Layout>
        <Footer className="app-footer">
          <a href="https://github.com/hughdevore/digital-art-manager">
            <img src={GithubLogo} className="github-logo" alt="GitHub Logo with link to repository"/>
          </a>
        </Footer>
      </Layout>
    );
  }
}
export default App;