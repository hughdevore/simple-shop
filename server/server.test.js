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
            getItemsInCart: 'GET request to the /carts/:id will return all products in the cart',
            createCart: 'POST request to /carts will create a cart.',
            getCarts: 'GET request to the /carts/:id will return all carts in the cart',
            addItemsToCart: 'POST request to /carts/:id and passing the product_id will add a product to the cart.',
            removeItemsFromCart:
              'DELETE request to /cart/:id and passing the product_id will delete that product from the cart.'
          }
        }
      })
    )
    .end(done);
});
