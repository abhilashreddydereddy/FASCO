// backend/controllers/dashboardController.js
const pool = require("../config/db");

// This is the new single function for the dashboard
exports.getDashboardData = async (req, res) => {
  const client = await pool.connect();
  try {
    // We will run both queries in parallel
    const productsQuery = "SELECT * FROM products ORDER BY id ASC";
    
    const ordersQuery = `
      SELECT 
        o.id,
        o.order_date,
        o.total_amount,
        c.name AS customer_name,
        i.payment_status,
        (SELECT COUNT(oi.id) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN invoices i ON o.id = i.order_id
      ORDER BY o.order_date DESC;
    `;

    // Run both queries
    const [productsRes, ordersRes] = await Promise.all([
      client.query(productsQuery),
      client.query(ordersQuery)
    ]);

    // Send back the single JSON object that home.html expects
    res.json({
      products: productsRes.rows,
      orders: ordersRes.rows
    });

  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};