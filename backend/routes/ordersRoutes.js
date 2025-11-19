const express = require("express");
const router = express.Router();
// Note: 'ordersController' with an 's'
const { getAllOrders, getOrderDetails } = require("../controllers/ordersController");
const { downloadInvoice } = require("../controllers/invoiceController");

// Import our auth middleware
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminAccess = [authMiddleware, adminMiddleware];


// GET /api/orders/
// Get all orders for the history table
router.get("/", adminAccess, getAllOrders);

// GET /api/orders/:id
// Get details for a single order
router.get("/:id", adminAccess, getOrderDetails);

// router.get("/:id/download", adminAccess, downloadInvoice);

router.get("/:id/download", downloadInvoice);

module.exports = router;