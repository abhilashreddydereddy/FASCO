// backend/controllers/customerController.js
const pool = require("../config/db");

// GET all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id, 
        c.name, 
        c.phone, 
        c.payment_method,
        COUNT(o.id) AS total_orders,
        SUM(o.total_amount) AS total_spent
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id
      ORDER BY c.name;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// GET order history for a single customer (for the modal)
exports.getCustomerOrderHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        o.id,
        o.order_date,
        o.total_amount,
        i.invoice_number,
        i.payment_status
      FROM orders o
      LEFT JOIN invoices i ON o.id = i.order_id
      WHERE o.customer_id = $1
      ORDER BY o.order_date DESC;
    `;
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};