const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// Routes used by home.html
router.get("/products", dashboardController.getDashboardProducts);
router.get("/orders", dashboardController.getDashboardOrders);

module.exports = router;
