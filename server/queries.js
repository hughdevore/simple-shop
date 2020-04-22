const db = process.env.NODE_ENV === 'test' ? 'db_test' : 'db';
const {Pool} = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'postgres',
  database: db,
  password: 'pass',
  port: 5432
});

/**
 * Get all of the products from the database.
 * 
 * @param object request The incoming request from the API.
 * @param object response The response to send back.
 * @return void
 */
const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id DESC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

/**
 * Get a product from th database by its id.
 * 
 * @param object request The incoming request from the API.
 * @param object response The response to send back.
 * @return void
 */
const getProductById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

/**
 * Create a cart in the database.
 * 
 * @param object request The incoming request from the API.
 * @param object response The response to send back.
 * @return void
 */
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

/**
 * Get all of the carts from the database.
 * 
 * @param object request The incoming request from the API.
 * @param object response The response to send back.
 * @return void
 */
const getCarts = (request, response) => {
  pool.query('SELECT * FROM carts ORDER BY id DESC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

/**
 * Get all of the items from the cart with the requested id.
 * 
 * @param object request The incoming request from the API.
 * @param object response The response to send back.
 * @return void
 */
const getItemsInCart = (request, response) => {
  const cart_id = parseInt(request.params.id);
  pool.query(
    'SELECT products.id, products.price, products.name FROM products INNER JOIN carts_products ON products.id = carts_products.product_id WHERE carts_products.cart_id = $1',
    [cart_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
}

/**
 * Add an item or items to the cart with the requested id.
 * 
 * @param object request The incoming request from the API.
 * @param object response The response to send back.
 * @return void
 */
const addItemsToCart = (request, response) => {
  const cart_id = parseInt(request.params.id);
  const {product_id, quantity = 1} = request.body.data;
  let newItems = [];
  if(quantity === 1) {
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
  } else {
    for(let i = 0; i < quantity; i++) {
      pool.query(
        'INSERT INTO carts_products(product_id, cart_id) VALUES ($1, $2) RETURNING *',
        [product_id, cart_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          console.log(results.rows)
          newItems = [...newItems, ...results.rows];
        }
      );
    }
    response.status(201).json(newItems);
  }
};

/**
 * Remove all of a product from the cart with the requested id.
 * 
 * @param object request The incoming request from the API.
 * @param object response The response to send back.
 * @return void
 */
const removeItemsFromCart = (request, response) => {
  const cart_id = parseInt(request.params.id);
  const {product_id, quantity = 0} = request.body;
  if (quantity < 0) {
    return response.status(500);
  }
  pool.query(
    'DELETE FROM carts_products WHERE (id, cart_id, product_id) IN (SELECT id, cart_id, product_id FROM carts_products WHERE cart_id = $1 AND product_id = $2 OFFSET $3 ) RETURNING *',
    [cart_id, product_id, quantity],
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
  getCarts,
  getItemsInCart,
  addItemsToCart,
  removeItemsFromCart,
};