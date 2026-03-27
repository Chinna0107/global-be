const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('../db');
const auth = require('../middleware/auth');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [user] = await sql`SELECT * FROM users WHERE username = ${username}`;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/products
router.get('/products', auth, async (req, res) => {
  try {
    const products = await sql`SELECT *, id AS _id FROM products ORDER BY id`;
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/products
router.post('/products', auth, async (req, res) => {
  try {
    const { name, category, description, image, price, unit = 'kg', stock = 0, features = [], quantities = [] } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'name and category are required' });
    }
    const [product] = await sql`
      INSERT INTO products (name, category, description, image, price, unit, stock, features, quantities)
      VALUES (
        ${name}, ${category.toLowerCase()}, ${description}, ${image},
        ${price || null}, ${unit}, ${stock},
        ${JSON.stringify(features)}, ${JSON.stringify(quantities)}
      )
      RETURNING *, id AS _id
    `;
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', auth, async (req, res) => {
  try {
    const { name, category, description, image, price, unit, stock, features, quantities } = req.body;
    const [product] = await sql`
      UPDATE products SET
        name        = COALESCE(${name ?? null}, name),
        category    = COALESCE(${category ? category.toLowerCase() : null}, category),
        description = COALESCE(${description ?? null}, description),
        image       = COALESCE(${image ?? null}, image),
        price       = COALESCE(${price ?? null}, price),
        unit        = COALESCE(${unit ?? null}, unit),
        stock       = COALESCE(${stock ?? null}, stock),
        features    = COALESCE(${features ? JSON.stringify(features) : null}::jsonb, features),
        quantities  = COALESCE(${quantities ? JSON.stringify(quantities) : null}::jsonb, quantities)
      WHERE id = ${req.params.id}
      RETURNING *, id AS _id
    `;
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', auth, async (req, res) => {
  try {
    const [product] = await sql`DELETE FROM products WHERE id = ${req.params.id} RETURNING id`;
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
