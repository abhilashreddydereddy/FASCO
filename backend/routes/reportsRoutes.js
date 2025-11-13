// backend/routes/reportsRoutes.js
const express = require("express");
const router = express.Router();
const { getReportData } = require("../controllers/reportsController");

// Import our auth middleware
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminAccess = [authMiddleware, adminMiddleware]; // Middleware array to protect routes

// GET /api/reports
// This single endpoint will get all report data based on query params
// e.g., /api/reports?startDate=2024-01-01&endDate=2024-01-31
router.get("/", adminAccess, getReportData);

module.exports = router;