const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.error('Authorization header missing or token not provided');
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  console.log('Received token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debugging: Log decoded token
    req.user = decoded; // Attach decoded user info to the request object
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message); // Log error for debugging
    if (err.name === 'JsonWebTokenError') {
      const message = err.message === 'jwt malformed'
        ? 'Malformed token, authorization denied'
        : 'Invalid token format, authorization denied';
      return res.status(401).json({ message });
    }
    return res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

module.exports = auth;