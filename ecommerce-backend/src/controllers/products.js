const pool = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const { category, search, sort = 'newest', inStock } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    if (category) {
      params.push(category);
      query += ` AND category_id = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }
    if (inStock === 'true') {
      query += ' AND stock > 0';
    }
    
    const orderBy = {
      'newest': 'created_at DESC',
      'price-asc': 'price ASC',
      'price-desc': 'price DESC',
      'name-asc': 'name ASC',
      'name-desc': 'name DESC'
    }[sort] || 'created_at DESC';
    
    query += ` ORDER BY ${orderBy}`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE featured = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
