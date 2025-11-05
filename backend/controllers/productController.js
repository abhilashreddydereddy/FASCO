// backend/controllers/productController.js
const pool = require("../config/db");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(products.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  const { code, name, category, stock, unit, price, minStock, description } = req.body;
  try {
    const newProduct = await pool.query(
      "INSERT INTO products (code, name, category, stock, unit, price, min_stock, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [code, name, category, stock, unit, price, minStock, description]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { code, name, category, stock, unit, price, minStock, description } = req.body;
  try {
    const updatedProduct = await pool.query(
      "UPDATE products SET code = $1, name = $2, category = $3, stock = $4, unit = $5, price = $6, min_stock = $7, description = $8 WHERE id = $9 RETURNING *",
      [code, name, category, stock, unit, price, minStock, description, id]
    );
    res.json(updatedProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};