const supertest = require('supertest');
const app = require('./server');

test('GET /', done => {
  supertest(app)
    .get('/')
    .expect(
      200,
      JSON.stringify({
        data: {
          message: 'Welcome to the API!',
          routes: {
            getProducts: 'GET request to /products will return an array of products.',
            getProductById: 'GET request to /products/:id will return that product.',
            createCart: 'POST request to /carts will create a cart.',
            deleteCart: 'DELETE request to /carts/:id will delete a cart.',
            addItemToCart: 'POST request to /carts/:id and passing the product_id will add a product to the cart.',
            removeItemFromCart:
              'DELETE request to /cart/:id and passing the product_id will delete that product from the cart.'
          }
        }
      })
    )
    .end(done);
});
