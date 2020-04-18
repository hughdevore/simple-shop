import React from 'react';
import moment from 'moment';
import axios from 'axios';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {
  Button,
  Statistic,
  Card,
  Row,
  Col 
} from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Cart = (props) => {
//   const [form] = Form.useForm();
  
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

  return (
    <div className="site-statistic-demo-card">
        <Card>
            <Statistic
                title="Subtotal"
                value={100.57}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix="$"
            />
        </Card>
        <Card>
            <Statistic
                title="Shipping & Taxes"
                value={21.00}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix="$"
            />
        </Card>
        <Card>
            <Statistic
                title="Amount Due"
                value={121.57}
                precision={2}
                valueStyle={{ color: "black", fontWeight: 800 }}
                prefix="$"
            />
        </Card>
    </div>
  );
}

export default Cart;