import React, {Component, Fragment} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {ShoppingCartOutlined} from '@ant-design/icons';
import {
  Button,
  Empty,
  List,
  Select,
  Statistic
} from 'antd';

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
  padding-bottom: .5em;
  font-size: 1.25em;
`;

const Total = styled.span`
  color: black;
`;

const TotalContainer = styled.span`
  width: 100%;
  display: inline-block;
  padding: .25em 0;
  font-size: 1.5em;
  border-top: 1px solid rgb(82, 82, 82);
  border-bottom: 1px solid rgb(82, 82, 82);
`;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

class Cart extends Component {

  state = {
    cartItems: [],
    cartTaxesAndShipping: 0,
    cartTotal: 0,
  }

  componentDidMount() {
    this.getCartList();
  }

  getCartList = async () => {
    const response = await axios.get('http://localhost:3100/carts/1');
    const body = response.data;
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    this.setState({ 
      cartItems: body,
    });
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }
  
//   const onFinish = async (values) => {
//     const { artist, date, description, height, name, width } = values;
//     let art = {
//       artist: artist ? artist : 'Hughie Devore',
//       date: date ? date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
//       description: description ? description : 'A beautiful view of snowy peaks in the rocky mountains.',
//       height: height ? height : 1000,
//       name: name ? name : 'Rocky Mountain Masterpiece',
//       width: width ? width : 1250,
//     };

//     const response = await axios.post('http://localhost:3100/art', art);
//     const body = response.data;
//     if (response.status !== 201) {
//       notification.error({
//         message: 'Error, your art could not be added to the manager.',
//         description: body.message,
//         onClick: () => {
//           console.log('Notification Clicked!');
//         },
//       });
//     } else {
//       notification.success({
//         message: 'Your art was added to the manager!',
//         description: body.message,
//         onClick: () => {
//           console.log('Notification Clicked!');
//         },
//       });
//       props.getArtList();
//     }
//   };

  cartQuantity = (item) => {
    return (
      <Select defaultValue="7" onChange={this.handleChange}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
      </Select>
    );
  }

  render() {
    const {cartItems, cartTaxesAndShipping, cartTotal} = this.state;
    return (
      <div>
        <CartHeader>Cart Summary</CartHeader>
        <List
          locale={{ 
            emptyText: (
              <Empty
                image={<ShoppingCartOutlined />}
                style={{
                  fontSize: '7em'
                }}
                description={
                  <span style={{fontSize: '18px'}}>
                    Add items to your cart!
                  </span>
                }
              />
            )
          }}
          emptyText="No items in your cart"
          itemLayout="horizontal"
          dataSource={cartItems}
          renderItem={item => (
            <List.Item
          actions={[<Price>{item.price}</Price>,this.cartQuantity(item.quantity)]}
            >
              <List.Item.Meta
                title={item.name}
              />
            </List.Item>
        )}
        />
        <TaxesContainer>
          <span>Taxes</span>
          <TaxesAmount>{formatter.format(cartTaxesAndShipping)}</TaxesAmount>
        </TaxesContainer>
        <TotalContainer>
          <Total>Cart Total</Total>
          <TotalAmount>{formatter.format(cartTotal)}</TotalAmount>
        </TotalContainer>
        <div style={{padding: '3em', textAlign: 'center'}}>
          <Button 
            size="large"
            type="primary"
            style={{
              backgroundColor: 'green',
              fontSize: '2em',
              height: '2.25em',
              border: 'none',
            }}
          >
            Checkout
          </Button>
        </div>
      </div>
    );
  }
}

export default Cart;