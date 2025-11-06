const pool = require("../config/db");

// GET all orders for the main history page
exports.getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT 
        o.id, 
        o.order_date, 
        o.total_amount, 
        c.name AS customer_name, 
        i.payment_status,
        i.invoice_number
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN invoices i ON o.id = i.order_id
      ORDER BY o.order_date DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// GET all items for a single order (for the modal)
exports.getOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    // Get order and customer info
    const orderInfoQuery = `
      SELECT 
        o.id, o.order_date, o.subtotal, o.tax, o.total_amount,
        c.name AS customer_name, c.phone AS customer_phone,
        i.invoice_number, i.payment_method, i.payment_status
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN invoices i ON o.id = i.order_id
      WHERE o.id = $1;
    `;
    const orderRes = await pool.query(orderInfoQuery, [id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Get the line items for that order
    const itemsQuery = `
      SELECT 
        oi.quantity, 
        oi.price_per_unit, 
        oi.subtotal,
        p.name AS product_name,
        p.code AS product_code
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1;
    `;
    const itemsRes = await pool.query(itemsQuery, [id]);
    
    // Combine and send
    res.json({
      details: orderRes.rows[0],
      items: itemsRes.rows
    });

  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};