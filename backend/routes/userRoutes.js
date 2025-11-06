// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  createUserByAdmin,
  deleteUser
} = require("../controllers/userController");

// Import our new middleware
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// --- Public Routes ---
// (Anyone can register or login)
router.post("/register", registerUser);
router.post("/login", loginUser);

// --- Admin-Only Routes ---
// (Only logged-in admins can access these)
const adminAuth = [authMiddleware, adminMiddleware];

// GET /api/users/ (Get all users)
router.get("/", adminAuth, getAllUsers);

// POST /api/users/ (Admin creates a new user)
router.post("/", adminAuth, createUserByAdmin);

// DELETE /api/users/:id (Admin deletes a user)
router.delete("/:id", adminAuth, deleteUser);

module.exports = router;