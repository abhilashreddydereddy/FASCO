// backend/controllers/invoiceController.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

exports.downloadInvoice = async (req, res) => {
  const orderId = req.params.id;

  try {
    // ===== FETCH ORDER =====
    const orderQ = await pool.query(
      `SELECT 
         o.id, o.order_date, o.total_amount,
         c.name AS customer_name, c.phone AS customer_phone,
         i.invoice_number, i.invoice_date, i.payment_method
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       LEFT JOIN invoices i ON o.id = i.order_id
       WHERE o.id = $1`,
      [orderId]
    );

    if (!orderQ.rows.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderQ.rows[0];

    // ===== FETCH ITEMS =====
    const itemsQ = await pool.query(
      `SELECT oi.quantity, oi.price_per_unit, oi.subtotal,
              p.name AS product_name, p.code AS product_code
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    const items = itemsQ.rows;

    // ===== PDF SETUP =====
    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    const filename = (order.invoice_number || `invoice-${orderId}`).replace(/\s+/g, "_");
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}.pdf"`);

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const borderPadding = 25;

    // ===== PAGE BORDER =====
    doc.rect(
      borderPadding,
      borderPadding,
      pageWidth - borderPadding * 2,
      pageHeight - borderPadding * 2
    )
      .lineWidth(1)
      .strokeColor('#999')
      .stroke();

    // --- Layout positions ---
    let startX = borderPadding + 25;
    let y = borderPadding + 40;

    // ===== LOGO =====
    const logoPath = path.join(__dirname, '../assets/icons/logo.png'); 
    if (fs.existsSync(logoPath)) {
      try {
        doc.image(logoPath, startX, y - 10, { width: 80 });
      } catch {}
    }

    // ===== COMPANY INFO =====
    doc.fontSize(22).fillColor("#ff5e62").text("FASCO", startX + 100, y);
    doc.fontSize(11).fillColor("#000").text("Fire Safety Equipment & Services", startX + 100, y + 25);
    doc.text("Shuwaikh Industrial Area, Block 1", startX + 100, y + 40);
    doc.text("Kuwait City, Kuwait", startX + 100, y + 55);
    doc.text("Phone: +965 2220 1111", startX + 100, y + 70);

    // ===== INVOICE INFO =====
    doc.fontSize(20).fillColor("#333").text("INVOICE", 0, y, { align: "right" });
    doc.fontSize(11)
      .text(`Invoice #: ${order.invoice_number}`, { align: "right" })
      .text(`Date: ${new Date(order.invoice_date || order.order_date).toLocaleDateString()}`, { align: "right" })
      .text(`Payment: ${order.payment_method || "N/A"}`, { align: "right" });

    // ===== CUSTOMER INFO =====
    doc.fontSize(12).fillColor("#333").text("Bill To:", startX, y + 130);
    doc.fontSize(11).text(order.customer_name || "N/A", startX, y + 148);
    if (order.customer_phone) doc.text(order.customer_phone, startX, y + 164);

    // ===== TABLE HEADER =====
    const tableTop = y + 210;
    const tableWidth = 480;

    doc.rect(startX, tableTop, tableWidth, 30)
      .fill('#eaeaea')
      .stroke();

    const colX = {
      index: startX + 10,
      product: startX + 50,
      qty: startX + 300,
      unit: startX + 360,
      total: startX + 420
    };

    doc.fillColor('#000').font('Helvetica-Bold').fontSize(11);
    doc.text("#", colX.index, tableTop + 9);
    doc.text("Product", colX.product, tableTop + 9);
    doc.text("Qty", colX.qty, tableTop + 9, { width: 40, align: "right" });
    doc.text("Unit Price", colX.unit, tableTop + 9, { width: 60, align: "right" });
    doc.text("Total", colX.total, tableTop + 9, { width: 60, align: "right" });

    // ===== TABLE ROWS =====
    let yPos = tableTop + 30;
    doc.font("Helvetica").fontSize(10);

    items.forEach((item, i) => {
      const rowH = 28;

      // Row border
      doc.rect(startX, yPos, tableWidth, rowH).strokeColor("#ccc").stroke();

      // Shading alternate rows
      if (i % 2 === 0) {
        doc.rect(startX, yPos, tableWidth, rowH)
          .fillOpacity(0.15)
          .fill('#f8f8f8')
          .fillOpacity(1);
      }

      const productName = `${item.product_name}${item.product_code ? ` (${item.product_code})` : ""}`;

      doc.fillColor("#000");
      doc.text(i + 1, colX.index, yPos + 8);
      doc.text(productName, colX.product, yPos + 8, { width: 240 });
      doc.text(item.quantity, colX.qty, yPos + 8, { width: 40, align: "right" });
      doc.text(`KD ${Number(item.price_per_unit).toFixed(3)}`, colX.unit, yPos + 8, { width: 60, align: "right" });
      doc.text(`KD ${Number(item.subtotal).toFixed(3)}`, colX.total, yPos + 8, { width: 60, align: "right" });

      yPos += rowH;
    });

    // ===== TOTAL =====
    doc.moveTo(startX, yPos + 10).lineTo(startX + tableWidth, yPos + 10).stroke();

    doc.fontSize(12).font("Helvetica-Bold")
      .text(`Grand Total: KD ${Number(order.total_amount).toFixed(3)}`, startX, yPos + 20, {
        align: "right",
        width: tableWidth
      });

    // ===== FOOTER =====
    doc.fontSize(10).fillColor("#666")
      .text("Thank you for your business!", startX, yPos + 60, { width: tableWidth, align: "center" });

    doc.end();

  } catch (err) {
    console.error("Invoice PDF error:", err);
    res.status(500).json({ error: "Server error generating invoice" });
  }
};
