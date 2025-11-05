// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// GET all products
router.get("/", getAllProducts);

// POST a new product
router.post("/", addProduct);

// PUT (update) a product by id
router.put("/:id", updateProduct);

// DELETE a product by id
router.delete("/:id", deleteProduct);

module.exports = router;