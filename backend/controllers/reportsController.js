// backend/controllers/reportsController.js
const pool = require("../config/db");

// GET /api/reports?startDate=...&endDate=...
exports.getReportData = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Basic validation
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required." });
  }

  // Use a single client for all queries
  const client = await pool.connect();

  try {
    // We will run all our report queries in parallel for speed
    const [kpiStats, topProducts, topCustomers, salesOverTime] = await Promise.all([
      getKpiStats(client, startDate, endDate),
      getTopProducts(client, startDate, endDate),
      getTopCustomers(client, startDate, endDate),
      getSalesOverTime(client, startDate, endDate)
    ]);

    res.json({
      kpiStats: kpiStats.rows[0],
      topProducts: topProducts.rows,
      topCustomers: topCustomers.rows,
      salesOverTime: salesOverTime.rows
    });

  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  } finally {
    client.release(); // Always release the client
  }
};

// --- Sub-functions for each report component ---

// 1. Get Key Performance Indicators (KPIs)
function getKpiStats(client, startDate, endDate) {
  const query = `
    SELECT
      -- SUM(total_amount) AS total_revenue: Calculates the total money earned.
      COALESCE(SUM(total_amount), 0) AS total_revenue,
      
      -- COUNT(DISTINCT id) AS total_orders: Counts the number of unique orders.
      COUNT(DISTINCT id) AS total_orders,
      
      -- COUNT(DISTINCT customer_id) AS total_customers: Counts the unique customers.
      COUNT(DISTINCT customer_id) AS total_customers
    FROM orders
    WHERE order_date BETWEEN $1 AND $2;
  `;
  return client.query(query, [startDate, endDate]);
}

// 2. Get Top 5 Selling Products
function getTopProducts(client, startDate, endDate) {
  const query = `
    SELECT
      p.name AS product_name,
      p.code AS product_code,
      
      -- SUM(oi.quantity) AS total_quantity_sold: Counts how many units were sold.
      SUM(oi.quantity) AS total_quantity_sold
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.order_date BETWEEN $1 AND $2
    GROUP BY p.id, p.name, p.code
    ORDER BY total_quantity_sold DESC
    LIMIT 5;
  `;
  return client.query(query, [startDate, endDate]);
}

// 3. Get Top 5 Customers
function getTopCustomers(client, startDate, endDate) {
  const query = `
    SELECT
      c.name AS customer_name,
      
      -- SUM(o.total_amount) AS total_spent: Finds the highest paying customers.
      SUM(o.total_amount) AS total_spent,
      
      -- COUNT(o.id) AS order_count: Shows how many orders they placed.
      COUNT(o.id) AS order_count
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.order_date BETWEEN $1 AND $2
    GROUP BY c.id, c.name
    ORDER BY total_spent DESC
    LIMIT 5;
  `;
  return client.query(query, [startDate, endDate]);
}

// 4. Get Sales Over Time (for the line chart)
function getSalesOverTime(client, startDate, endDate) {
  const query = `
    SELECT
      -- DATE(order_date) AS date: Groups all sales by the day they happened.
      DATE(order_date) AS date,
      
      -- SUM(total_amount) AS daily_revenue: Calculates total sales for that day.
      SUM(total_amount) AS daily_revenue
    FROM orders
    WHERE order_date BETWEEN $1 AND $2
    GROUP BY DATE(order_date)
    ORDER BY date ASC;
  `;
  return client.query(query, [startDate, endDate]);
}