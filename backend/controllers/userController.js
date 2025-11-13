// backend/controllers/userController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// --- PUBLIC FUNCTIONS ---

// (This is for the public register.html page)
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    // New users default to 'staff' role
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'staff') RETURNING id, email",
      [username, email, hashed]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
};

// (This is for the public login.html page)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!user.rows.length) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) return res.status(400).json({ error: "Incorrect password" });

    // We now sign the user's ID AND ROLE into the token
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role }, 
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// --- ADMIN-ONLY FUNCTIONS ---

// GET all users for the admin page
exports.getAllUsers = async (req, res) => {
  try {
    // Send all users, but hide their passwords
    const users = await pool.query("SELECT id, username, email, role FROM users ORDER BY id ASC");
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST a new user (created by admin)
exports.createUserByAdmin = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
      [username, email, hashed, role]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
};

// DELETE a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  // Safety check: prevent admin from deleting their own account
  if (req.user.id == id) { // req.user.id comes from the auth middleware
    return res.status(400).json({ error: "Admin cannot delete their own account." });
  }
  
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- NEW FUNCTION FOR LOGGED-IN USERS ---

// POST /api/users/change-password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Get user ID from the authMiddleware token

  try {
    // 1. Get the user's current password hash from the DB
    const user = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const currentHashedPassword = user.rows[0].password;

    // 2. Check if the 'currentPassword' they typed is correct
    const validPassword = await bcrypt.compare(currentPassword, currentHashedPassword);
    if (!validPassword) {
      return res.status(400).json({ error: "Incorrect current password." });
    }

    // 3. Hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update the password in the database
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [newHashedPassword, userId]);

    res.json({ success: true, message: "Password updated successfully." });

  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};