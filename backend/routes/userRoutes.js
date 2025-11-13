// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  createUserByAdmin,
  deleteUser,
  changePassword // <-- IMPORT THE NEW FUNCTION
} = require("../controllers/userController");

// Import our auth middleware
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// --- Public Routes ---
// (Anyone can register or login)
router.post("/register", registerUser);
router.post("/login", loginUser);

// --- Admin-Only Routes ---
// (Only logged-in admins can access these)
const adminAccess = [authMiddleware, adminMiddleware];

// GET /api/users/ (Get all users)
router.get("/", adminAccess, getAllUsers);

// POST /api/users/ (Admin creates a new user)
router.post("/", adminAccess, createUserByAdmin);

// DELETE /api/users/:id (Admin deletes a user)
router.delete("/:id", adminAccess, deleteUser);

// --- NEW LOGGED-IN USER ROUTE ---
// (Any logged-in user can change their own password)
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;