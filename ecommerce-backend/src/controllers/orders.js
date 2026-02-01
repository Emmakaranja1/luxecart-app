const pool = require('../config/database');

exports.create = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { shipping_address, items } = req.body;
    
    const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const shipping_cost = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping_cost + tax;
    
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, shipping_address, subtotal, shipping_cost, tax, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, JSON.stringify(shipping_address), subtotal, shipping_cost, tax, total]
    );
    
    const order = orderResult.rows[0];
    
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, total) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [order.id, item.product_id, item.product_name, item.product_image, item.quantity, item.unit_price, item.unit_price * item.quantity]
      );
    }
    
    await client.query(
      'INSERT INTO payments (order_id, amount, payment_method) VALUES ($1, $2, $3)',
      [order.id, total, 'Credit Card']
    );
    
    await client.query('COMMIT');
    
    const fullOrder = await pool.query(
      'SELECT o.*, json_agg(oi.*) as items FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.id = $1 GROUP BY o.id',
      [order.id]
    );
    
    res.status(201).json(fullOrder.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT o.*, json_agg(oi.*) as items FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT o.*, json_agg(oi.*) as items FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.id = $1 AND o.user_id = $2 GROUP BY o.id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
