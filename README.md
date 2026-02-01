# LUXECART - Modern E-commerce Platform

LUXECART is a full-stack e-commerce platform built with modern web technologies, featuring a React.js frontend and a Node.js/Express.js backend with PostgreSQL database.

## 🚀 Features

- **User Authentication** - Secure signup and login with JWT
- **Product Catalog** - Browse and search products with categories
- **Shopping Cart** - Add/remove items, update quantities
- **Order Management** - Track order history and status
- **Responsive Design** - Works on desktop and mobile devices
- **Admin Dashboard** - Manage products, orders, and users

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Zustand for state management
- Framer Motion for animations
- Vite as build tool

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT for authentication
- Express Validator for request validation

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher)
- Git

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ecommerce-backend


2. Install dependencies:

npm install

3. Create a .env file in the backend directory with:
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/luxecart
JWT_SECRET=your_jwt_secret
NODE_ENV=development


4. Run database migrations:
npm run migrate

5. Start the development server:
npm run dev

Frontend Setup
1. Navigate to the frontend directory:
cd ../ecommerce-frontend


2. Install dependencies:
npm install


3. Start the development server:
npm run dev




Open http://localhost:5173 in your browser.


###🌟 Project Structure
luxecart/
├── ecommerce-backend/     # Backend API
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── server.js      # Express server
│
└── ecommerce-frontend/    # Frontend React app
    ├── public/            # Static files
    └── src/
        ├── components/    # Reusable components
        ├── pages/         # Page components
        ├── store/         # State management
        └── App.tsx        # Main component


🤝 Contributing
Fork the repository
Open a Pull Request


📄 License
This project is licensed under the MIT License.