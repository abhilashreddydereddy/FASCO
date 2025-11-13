// backend/controllers/supplierController.js
const pool = require("../config/db");

// GET all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    // This query also counts how many products each supplier is linked to
    const query = `
      SELECT 
        s.id, 
        s.name, 
        s.contact_person, 
        s.phone, 
        s.email,
        COUNT(ps.product_id) AS product_count
      FROM suppliers s
      LEFT JOIN product_suppliers ps ON s.id = ps.supplier_id
      GROUP BY s.id
      ORDER BY s.name;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// POST (create) a new supplier
exports.addSupplier = async (req, res) => {
  const { name, contact_person, phone, email, address } = req.body;
  try {
    const newSupplier = await pool.query(
      "INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, contact_person, phone, email, address]
    );
    // Return the new supplier (with product_count = 0)
    res.json({ ...newSupplier.rows[0], product_count: 0 });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// PUT (update) a supplier
exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, contact_person, phone, email, address } = req.body;
  try {
    const updatedSupplier = await pool.query(
      "UPDATE suppliers SET name = $1, contact_person = $2, phone = $3, email = $4, address = $5 WHERE id = $6 RETURNING *",
      [name, contact_person, phone, email, address, id]
    );
    if (updatedSupplier.rows.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json(updatedSupplier.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// DELETE a supplier
exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    // The database is set to ON DELETE CASCADE,
    // so deleting a supplier will also remove its links in product_suppliers
    await pool.query("DELETE FROM suppliers WHERE id = $1", [id]);
    res.json({ success: true, message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// --- Functions for linking products to suppliers ---

// GET products for a specific supplier
exports.getSupplierProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT p.id, p.code, p.name, p.category
      FROM products p
      JOIN product_suppliers ps ON p.id = ps.product_id
      WHERE ps.supplier_id = $1;
    `;
    const products = await pool.query(query, [id]);
    
    // Also get all products NOT supplied by this supplier
    const notSuppliedQuery = `
      SELECT id, code, name FROM products
      WHERE id NOT IN (
        SELECT product_id FROM product_suppliers WHERE supplier_id = $1
      );
    `;
    const notSupplied = await pool.query(notSuppliedQuery, [id]);

    res.json({
      supplied: products.rows,
      notSupplied: notSupplied.rows
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// POST (add) a product link to a supplier
exports.addProductToSupplier = async (req, res) => {
  const { supplierId, productId } = req.body;
  try {
    await pool.query(
      "INSERT INTO product_suppliers (supplier_id, product_id) VALUES ($1, $2)",
      [supplierId, productId]
    );
    res.json({ success: true, message: "Product linked to supplier" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// DELETE a product link from a supplier
exports.removeProductFromSupplier = async (req, res) => {
  const { supplierId, productId } = req.params;
  try {
    await pool.query(
      "DELETE FROM product_suppliers WHERE supplier_id = $1 AND product_id = $2",
      [supplierId, productId]
    );
    res.json({ success: true, message: "Product unlinked from supplier" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};