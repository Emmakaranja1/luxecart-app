const pool = require('../src/config/database');
const bcrypt = require('bcryptjs');

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding database...');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10);
    await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, [process.env.ADMIN_EMAIL || 'admin@luxecart.com', hashedPassword, 'Admin', 'User', 'admin']);
    
    // Seed categories
    const categories = [
      ['Electronics', 'electronics', 'Cutting-edge gadgets and tech accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600'],
      ['Clothing', 'clothing', 'Premium fashion and apparel', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600'],
      ['Home & Garden', 'home-garden', 'Elegant home decor', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'],
      ['Sports', 'sports', 'Fitness equipment', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600'],
      ['Books', 'books', 'Literature and educational', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600']
    ];
    
    for (const cat of categories) {
      await client.query(
        'INSERT INTO categories (name, slug, description, image_url) VALUES ($1, $2, $3, $4) ON CONFLICT (slug) DO NOTHING',
        cat
      );
    }
    
    // Get category IDs
    const catResult = await client.query('SELECT id, slug FROM categories');
    const catMap = {};
    catResult.rows.forEach(row => catMap[row.slug] = row.id);
    
    // Seed products
    const products = [
      [catMap['electronics'], 'Wireless Noise-Cancelling Headphones', 'wireless-noise-cancelling-headphones', 'Premium headphones with 30-hour battery life', 299.99, 349.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 45, true],
      [catMap['electronics'], 'Smart Watch Pro', 'smart-watch-pro', 'Advanced fitness tracking', 399.99, null, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 32, true],
      [catMap['electronics'], 'Ultra-Wide Gaming Monitor', 'ultra-wide-gaming-monitor', '34" curved display, 144Hz', 599.99, 699.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', 18, false],
      [catMap['electronics'], 'Mechanical Keyboard RGB', 'mechanical-keyboard-rgb', 'Premium mechanical switches', 159.99, null, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', 67, false],
      [catMap['clothing'], 'Premium Leather Jacket', 'premium-leather-jacket', 'Genuine leather', 449.99, 549.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 25, true],
      [catMap['clothing'], 'Designer Sneakers', 'designer-sneakers', 'Limited edition', 189.99, null, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', 0, false],
      [catMap['clothing'], 'Cashmere Sweater', 'cashmere-sweater', '100% pure cashmere', 229.99, null, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 41, false],
      [catMap['home-garden'], 'Smart LED Floor Lamp', 'smart-led-floor-lamp', 'App-controlled lighting', 149.99, 199.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', 54, true],
      [catMap['home-garden'], 'Minimalist Wall Clock', 'minimalist-wall-clock', 'Silent movement', 59.99, null, 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800', 89, false],
      [catMap['home-garden'], 'Luxury Throw Blanket', 'luxury-throw-blanket', 'Ultra-soft microfiber', 79.99, null, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800', 73, false],
      [catMap['sports'], 'Yoga Mat Premium', 'yoga-mat-premium', 'Extra-thick, non-slip', 49.99, null, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', 96, false],
      [catMap['sports'], 'Adjustable Dumbbells Set', 'adjustable-dumbbells-set', '5-52.5 lbs range', 329.99, 399.99, 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800', 22, false],
      [catMap['sports'], 'Running Shoes Elite', 'running-shoes-elite', 'Lightweight and responsive', 139.99, null, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 58, false],
      [catMap['books'], 'The Art of Programming', 'the-art-of-programming', 'Software development guide', 44.99, null, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800', 112, false],
      [catMap['books'], 'Mindfulness for Modern Life', 'mindfulness-for-modern-life', 'Practical mindfulness guide', 24.99, null, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800', 87, false]
    ];
    
    for (const prod of products) {
      await client.query(
        'INSERT INTO products (category_id, name, slug, description, price, compare_at_price, image_url, stock, featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (slug) DO NOTHING',
        prod
      );
    }
    
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seed().then(() => process.exit(0)).catch(() => process.exit(1));
