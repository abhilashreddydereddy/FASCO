// backend/routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierProducts,
  addProductToSupplier,
  removeProductFromSupplier
} = require("../controllers/supplierController");

// Import our auth middleware
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminAccess = [authMiddleware, adminMiddleware]; // Middleware array to protect routes

// === Main Supplier Routes (/api/suppliers) ===

// GET all suppliers
router.get("/", adminAccess, getAllSuppliers);

// POST (create) a new supplier
router.post("/", adminAccess, addSupplier);

// PUT (update) a supplier by ID
router.put("/:id", adminAccess, updateSupplier);

// DELETE a supplier by ID
router.delete("/:id", adminAccess, deleteSupplier);

// === Product Linking Routes (/api/suppliers) ===

// GET all products for a specific supplier
router.get("/:id/products", adminAccess, getSupplierProducts);

// POST (add) a product link to a supplier
// We send IDs in the body for this one
router.post("/products", adminAccess, addProductToSupplier);

// DELETE a product link from a supplier
// We send IDs in the params for this one
router.delete("/:supplierId/products/:productId", adminAccess, removeProductFromSupplier);

module.exports = router;