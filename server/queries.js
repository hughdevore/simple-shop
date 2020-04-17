const db = process.env.NODE_ENV === 'test' ? 'db_test' : 'db';
const {Pool} = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'postgres',
  database: db,
  password: 'pass',
  port: 5432
});

const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id DESC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getProductById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createCart = (request, response) => {
  pool.query(
    'INSERT INTO carts(created_at) VALUES(DEFAULT) RETURNING id',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json(results.rows);
    }
  );
};

const deleteCart = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    'DELETE FROM carts WHERE id = $1 RETURNING id',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const addItemToCart = (request, response) => {
  const cart_id = parseInt(request.params.id);
  const {product_id} = request.body;  
  pool.query(
    'INSERT INTO carts_products(product_id, cart_id) VALUES ($1, $2) RETURNING *',
    [product_id, cart_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json(results.rows);
    }
  );
};

const removeItemFromCart = (request, response) => {
  const cart_id = parseInt(request.params.id);
  const {product_id} = request.body;
  pool.query(
    'DELETE FROM carts_products WHERE cart_id = $1 && product_id = $2 RETURNING *',
    [cart_id, product_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

module.exports = {
  getProducts,
  getProductById,
  createCart,
  deleteCart,
  addItemToCart,
  removeItemFromCart
};
