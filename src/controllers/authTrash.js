const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key'; // Store securely in environment variables

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user already exists
  db.query(
    'SELECT * FROM users WHERE email = ? OR username = ?',
    [email, username],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (results.length > 0) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Error creating user' });

          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // Check user
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  });
});

module.exports = router;
// 

// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = verifyToken;
//
const verifyToken = require('./middleware/auth');
app.get('/products', verifyToken, (req, res) => {
  // Only accessible if authenticated
});
