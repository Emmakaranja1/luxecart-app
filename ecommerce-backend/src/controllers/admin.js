const pool = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  try {
    const revenue = await pool.query('SELECT COALESCE(SUM(total), 0) as total FROM orders');
    const orders = await pool.query('SELECT COUNT(*) as count FROM orders');
    const pending = await pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
    const products = await pool.query('SELECT COUNT(*) as count FROM products');
    const customers = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
    
    res.json({
      total_revenue: parseFloat(revenue.rows[0].total),
      total_orders: parseInt(orders.rows[0].count),
      pending_orders: parseInt(pending.rows[0].count),
      total_products: parseInt(products.rows[0].count),
      total_customers: parseInt(customers.rows[0].count),
      revenue_change: 12.5,
      orders_change: 8.3
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category_id, description, price, compare_at_price, stock, featured, image_url } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const result = await pool.query(
      'INSERT INTO products (category_id, name, slug, description, price, compare_at_price, image_url, stock, featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [category_id, name, slug, description, price, compare_at_price, image_url, stock, featured]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, category_id, description, price, compare_at_price, stock, featured, image_url } = req.body;
    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined;
    
    const result = await pool.query(
      'UPDATE products SET category_id = COALESCE($1, category_id), name = COALESCE($2, name), slug = COALESCE($3, slug), description = COALESCE($4, description), price = COALESCE($5, price), compare_at_price = $6, image_url = COALESCE($7, image_url), stock = COALESCE($8, stock), featured = COALESCE($9, featured) WHERE id = $10 RETURNING *',
      [category_id, name, slug, description, price, compare_at_price, image_url, stock, featured, req.params.id]
    );
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT o.*, json_agg(oi.*) as items FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id GROUP BY o.id ORDER BY o.created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
