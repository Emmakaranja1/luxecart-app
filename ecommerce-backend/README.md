# 🚀 LuxeCart Backend API

Node.js + Express + PostgreSQL backend for the LuxeCart e-commerce platform.

## Features

- ✅ RESTful API
- ✅ JWT Authentication
- ✅ PostgreSQL Database
- ✅ Admin Dashboard API
- ✅ Order Management
- ✅ Payment Processing
- ✅ Product CRUD
- ✅ User Management

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Password Hashing:** bcrypt
- **Validation:** express-validator

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

**Option A: Local PostgreSQL**

```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb ecommerce_db
```

**Option B: Use Supabase (Free)**

1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
NODE_ENV=development


```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Seed Database

```bash
npm run seed
```

This creates:
- Admin user
- 5 categories
- 15 products

### 6. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on http://localhost:3000

## API Endpoints

### Authentication

```
POST   /api/auth/signup      Register new user
POST   /api/auth/login       Login user
GET    /api/auth/me          Get current user (protected)
```

### Categories

```
GET    /api/categories       Get all categories
GET    /api/categories/:slug Get category by slug
```

### Products

```
GET    /api/products              Get all products (with filters)
GET    /api/products/featured     Get featured products
GET    /api/products/:id          Get product by ID
GET    /api/products/slug/:slug   Get product by slug
```

Query parameters for `/api/products`:
- `category` - Filter by category ID
- `search` - Search in name/description
- `sort` - Sort by: newest, price-asc, price-desc, name-asc, name-desc
- `inStock` - Filter in-stock items (true/false)

### Orders (Protected)

```
POST   /api/orders           Create new order
GET    /api/orders           Get user's orders
GET    /api/orders/:id       Get specific order
```

### Admin (Protected - Admin Only)

```
GET    /api/admin/stats              Dashboard statistics
POST   /api/admin/products           Create product
PUT    /api/admin/products/:id       Update product
DELETE /api/admin/products/:id       Delete product
GET    /api/admin/orders             Get all orders
PATCH  /api/admin/orders/:id         Update order status
GET    /api/admin/payments           Get all payments
PATCH  /api/admin/payments/:id       Update payment status
```


## Deployment

### Render (Free Tier)

1. Push code to GitHub
2. Go to https://render.com
3. Create "New Web Service"
4. Connect repository
5. Environment: Node
6. Build Command: `npm install`
7. Start Command: `npm start`
8. Add environment variables
9. Deploy!

### Railway (Free Tier)

1. Go to https://railway.app
2. Create PostgreSQL database first
3. Create new service from GitHub
4. Add environment variables (use DATABASE_URL from postgres)
5. Deploy!

## Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_production_secret_key
CORS_ORIGIN=https://your-frontend.netlify.app
```



## Project Structure

```
ecommerce-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── admin.js
│   └── server.js
├── scripts/
│   ├── migrate.js
│   └── seed.js
├── .env.example
├── package.json
└── README.md
```


## License

MIT
