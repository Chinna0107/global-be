const express = require('express');
const router = express.Router();
const sql = require('../db');

// GET /api/products?category=rice|millets|spices
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const products = category
      ? await sql`SELECT *, id AS _id FROM products WHERE category = ${category.toLowerCase()} ORDER BY id`
      : await sql`SELECT *, id AS _id FROM products ORDER BY id`;
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [product] = await sql`SELECT *, id AS _id FROM products WHERE id = ${req.params.id}`;
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
