process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const {Pool} = require('pg');
const app = require('./server');

const pool = new Pool({
  user: 'user',
  host: 'postgres',
  database: 'db_test',
  password: 'pass',
  port: 5432
});

const product = {
  name: 'Everyday Print Set',
  description:
    "With their high-quality look and feel, these photo prints are designed to honor the everyday. Choose from matte, double-thick matte, and satin paper options.",
  price: 9.01,
  image_url: "https://media.artifactuprising.com/media/catalog/product/p/r/prints-satin-hero-pdp.jpg?width=1300&auto=webp",
  quantity: 3,
};

beforeAll(async () => {
  await pool.query(
    'CREATE TABLE products( id SERIAL PRIMARY KEY, name TEXT, description TEXT, price MONEY, image_url TEXT, quantity INT );'
  );
  await pool.query(
    'CREATE TABLE carts( id SERIAL PRIMARY KEY, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP );'
  );
  await pool.query(
    'CREATE TABLE carts_products( id SERIAL PRIMARY KEY, product_id INT REFERENCES products(id), cart_id INT REFERENCES carts(id) );'
  );
});

beforeEach(async () => {
  // Seed with product data
  await pool.query(
    'INSERT INTO products(name, description, price, image_url, quantity) VALUES ($1, $2, $3, $4, $5), ($1, $2, $3, $4, $5);',
    [
      product.name,
      product.description,
      product.price,
      product.image_url,
      product.quantity,
    ]
  );
});

afterEach(async () => {
  await pool.query('DELETE FROM carts_products');
  await pool.query('DELETE FROM products');
  await pool.query('DELETE FROM carts');
});

afterAll(async () => {
  await pool.query('DROP TABLE carts_products');
  await pool.query('DROP TABLE products');
  await pool.query('DROP TABLE carts');
  pool.end();
});

describe("GET request to '/products'", () => {
  test('It should respond with an array of products', done => {
    supertest(app)
      .get('/products')
      .end((error, response) => {
        if (error) return done(error);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
          {
            id: 2,
            name: 'Everyday Print Set',
            description:
              "With their high-quality look and feel, these photo prints are designed to honor the everyday. Choose from matte, double-thick matte, and satin paper options.",
            price: '$9.01',
            image_url: "https://media.artifactuprising.com/media/catalog/product/p/r/prints-satin-hero-pdp.jpg?width=1300&auto=webp",
            quantity: 3,
          },
          {
            id: 1,
            name: 'Everyday Print Set',
            description:
              "With their high-quality look and feel, these photo prints are designed to honor the everyday. Choose from matte, double-thick matte, and satin paper options.",
            price: '$9.01',
            image_url: "https://media.artifactuprising.com/media/catalog/product/p/r/prints-satin-hero-pdp.jpg?width=1300&auto=webp",
            quantity: 3,
          }
        ]);
        done();
      });
  });
});

describe("GET request to '/products/:id'", () => {
  test('It should respond with the requested product', done => {
    supertest(app)
      .get('/products/3')
      .end((error, response) => {
        if (error) return done(error);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
          {
            id: 3,
            name: 'Everyday Print Set',
            description:
              "With their high-quality look and feel, these photo prints are designed to honor the everyday. Choose from matte, double-thick matte, and satin paper options.",
            price: '$9.01',
            image_url: "https://media.artifactuprising.com/media/catalog/product/p/r/prints-satin-hero-pdp.jpg?width=1300&auto=webp",
            quantity: 3,
          }
        ]);
        done();
      });
  });
});

describe('POST request to /carts', () => {
  test('It should respond with the newly created cart id', done => {
    supertest(app)
      .post('/carts')
      .expect(201, (error, response) => {
        expect(response.body).toEqual([
          {
            id: 1
          }
        ]);
        done();
      });
  });
});

describe('POST request to /carts/:id', () => {
  test('It should respond with the added cart item', async (done) => {
    // Seed with cart data
    const cart = await pool.query('INSERT INTO carts(created_at) VALUES(DEFAULT) RETURNING id;');
    const products = await pool.query('SELECT * FROM products ORDER BY id DESC;');
    supertest(app)
      .post(`/carts/${cart.rows[0].id}`)
      .send({
        data: {
          product_id: products.rows[0].id
        }
      })
      .expect(200, (error, response) => {
        expect(response.body).toEqual([
          {
            id: 1,
            cart_id: cart.rows[0].id,
            product_id: products.rows[0].id,
          }
        ]);
        done();
      });
  });
});

describe('DELETE request to /carts/:id', () => {
  test('It should respond with the deleted cart item id', async (done) => {
    // Seed with cart data
    const cart = await pool.query('INSERT INTO carts(created_at) VALUES(DEFAULT);');
    const addedProducts = await pool.query('INSERT INTO carts_products(product_id, cart_id) VALUES (10, 3) RETURNING *;')
    supertest(app)
      .delete('/carts/3')
      .send({
        product_id: 10
      })
      .expect(200, (error, response) => {
        expect(response.body).toEqual([
          {
            id: 2,
            product_id: 10,
            cart_id: 3,
          }
        ]);
        done();
      });
  });
});

describe('Test a 404', () => {
  test('It should respond with a 404 status', async () => {
    const response = await supertest(app).get('/nowhere');
    expect(response.statusCode).toBe(404);
  });
});
