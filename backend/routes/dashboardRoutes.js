// backend/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");

// Import our auth middleware
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminAccess = [authMiddleware, adminMiddleware]; // Protect the route

// GET /api/dashboard/
// This single route provides all data for the dashboard
router.get("/", adminAccess, getDashboardData);

module.exports = router;