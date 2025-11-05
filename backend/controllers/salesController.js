// backend/controllers/salesController.js
const pool = require("../config/db");

// Get all products that are IN STOCK
exports.getSalesProducts = async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT id, code, name, category, stock, price FROM products WHERE stock > 0 ORDER BY category, name"
    );
    res.json(products.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Sale (Order, Invoice, etc.)
exports.createSale = async (req, res) => {
  const { customerName, customerPhone, paymentMethod, cart, subtotal, tax, total } = req.body;

  // 1. Get a connection client from the pool
  const client = await pool.connect();

  try {
    // 2. Start a transaction
    await client.query("BEGIN");

    // 3. Create or find the customer
    // We can make this smarter later (e.g., find by phone)
    // For now, we just create a new customer for every sale
    const customerRes = await client.query(
    "INSERT INTO customers (name, phone, paymentMethod) VALUES ($1, $2, $3) RETURNING id",
    [customerName, customerPhone || null, paymentMethod || null]
    );

    const customerId = customerRes.rows[0].id;

    // 4. Create the order
    const orderRes = await client.query(
      "INSERT INTO orders (customer_id, subtotal, tax, total_amount) VALUES ($1, $2, $3, $4) RETURNING id, order_date",
      [customerId, subtotal, tax, total]
    );
    const orderId = orderRes.rows[0].id;
    const orderDate = orderRes.rows[0].order_date;

    // 5. Create order_items AND update product stock
    for (const item of cart) {
      // 5a. Insert into order_items
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, subtotal) VALUES ($1, $2, $3, $4, $5)",
        [orderId, item.id, item.quantity, item.price, item.price * item.quantity]
      );

      // 5b. Update stock in products table
      // This is the most critical part!
      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.id]
      );
    }

    // 6. Create the invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(orderId).padStart(5, '0')}`;
    const invoiceRes = await client.query(
      "INSERT INTO invoices (order_id, invoice_number, invoice_date, payment_method) VALUES ($1, $2, $3, $4) RETURNING *",
      [orderId, invoiceNumber, orderDate, paymentMethod]
    );

    // 7. Commit the transaction
    await client.query("COMMIT");

    // 8. Send back a success response with the new invoice data
    res.json({
      success: true,
      invoice: invoiceRes.rows[0],
      order: { id: orderId, date: orderDate },
      customer: { id: customerId, name: customerName, phone: customerPhone }
    });

  } catch (err) {
    // If ANY error occurs, roll back the transaction
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Transaction failed: " + err.message });
  } finally {
    // 9. ALWAYS release the client back to the pool
    client.release();
  }
};