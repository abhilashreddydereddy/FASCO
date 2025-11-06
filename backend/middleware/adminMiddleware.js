// backend/middleware/adminMiddleware.js
module.exports = function (req, res, next) {
  // req.user.role was set by the authMiddleware
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
};