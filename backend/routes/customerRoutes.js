// backend/routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllCustomers,
  getCustomerOrderHistory
} = require("../controllers/customerController");

// Import our auth middleware
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminAccess = [authMiddleware, adminMiddleware];

// GET /api/customers
// Get all customers for the main table
router.get("/", adminAccess, getAllCustomers);

// GET /api/customers/:id/orders
// Get all orders for a single customer
router.get("/:id/orders", adminAccess, getCustomerOrderHistory);

module.exports = router;