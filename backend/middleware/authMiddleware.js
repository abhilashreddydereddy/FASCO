// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token'); // We will send the token in a header
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This adds the { id, role } to the request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};