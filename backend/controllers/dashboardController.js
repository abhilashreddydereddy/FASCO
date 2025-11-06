const pool = require("../config/db");

// 🧩 Get all products (for dashboard)
exports.getDashboardProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching dashboard products:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🧾 Get all orders with customer names and item counts
exports.getDashboardOrders = async (req, res) => {
  try {
    const query = `
      SELECT 
        o.id,
        o.order_date,
        o.subtotal,
        o.tax,
        o.total_amount,
        c.name AS customer_name,
        COUNT(oi.id) AS item_count
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, c.name
      ORDER BY o.order_date DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching dashboard orders:", err);
    res.status(500).json({ error: err.message });
  }
};
