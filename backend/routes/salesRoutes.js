// backend/routes/salesRoutes.js
const express = require("express");
const router = express.Router();
const { getSalesProducts, createSale } = require("../controllers/salesController");

// GET all products for the sales page
router.get("/products", getSalesProducts);

// POST a new sale
router.post("/", createSale);

module.exports = router;