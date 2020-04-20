const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./queries');

app.use(cors());
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (request, response) => {
  response.send({
    data: {
      message: 'Welcome to the API!',
      routes: {
        getProducts: 'GET request to /products will return an array of products.',
        getProductById: 'GET request to /products/:id will return that product.',
        getItemsInCart: 'GET request ti the /carts/:id will return all products in the cart',
        createCart: 'POST request to /carts will create a cart.',
        deleteCart: 'DELETE request to /carts/:id will delete a cart.',
        addItemToCart: 'POST request to /carts/:id and passing the product_id will add a product to the cart.',
        removeItemFromCart:
          'DELETE request to /cart/:id and passing the product_id will delete that product from the cart.'
      }
    }
  });
});

app.get('/products', db.getProducts);
app.get('/products/:id', db.getProductById);
app.post('/carts', db.createCart);
app.delete('/carts/:id', db.deleteCart);
app.get('/carts/:id', db.getItemsInCart);
app.post('/carts/:id', db.addItemToCart);
app.delete('/carts/:id', db.removeItemFromCart);

module.exports = app;
