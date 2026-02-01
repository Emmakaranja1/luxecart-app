# 🛒 LuxeCart - Premium E-Commerce Frontend

A modern, full-featured e-commerce frontend built with React, TypeScript, and Tailwind CSS. Features a bold and vibrant design with electric gradients, smooth animations, and a complete shopping experience.

![Tech Stack](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)

## ✨ Features

### 🎨 Design & UX
- **Bold Visual Design**: Electric cyan & magenta gradients with dark UI
- **Smooth Animations**: Framer Motion for page transitions and micro-interactions
- **Responsive**: Optimized for desktop, tablet, and mobile
- **Loading States**: Skeleton loaders for better perceived performance
- **Toast Notifications**: Real-time feedback for user actions

### 🛍️ E-Commerce Functionality
- **Product Catalog**: Browse products with filtering and sorting
- **Product Details**: Image galleries, stock indicators, quantity selectors
- **Shopping Cart**: Persistent cart with quantity management
- **Authentication**: Sign in/Sign up with form validation
- **Checkout**: Complete shipping form with order summary
- **Order History**: View past orders with detailed information
- **Order Tracking**: Visual status timeline for orders

### 🔧 Technical Features
- **State Management**: Zustand for cart and auth state
- **Mock API Layer**: Simulated backend calls with axios (ready for real backend)
- **TypeScript**: Full type safety throughout the application
- **Clean Architecture**: Organized folder structure for scalability
- **Reusable Components**: Modular component library

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ecommerce-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Button, Skeleton, etc.
│   ├── layout/         # Header, Footer, AppLayout
│   ├── product/        # ProductCard, ProductGrid
│   ├── cart/           # Cart-specific components
│   ├── auth/           # Auth-specific components
│   └── order/          # Order-specific components
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── AuthPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrdersPage.tsx
│   ├── OrderDetailPage.tsx
│   └── NotFoundPage.tsx
├── store/              # Zustand state management
│   ├── cartStore.ts
│   └── authStore.ts
├── services/           # API layer
│   └── api.ts          # Mock API with axios (backend-ready)
├── data/               # Mock data
│   ├── categories.ts
│   └── products.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Helper functions
│   └── helpers.ts
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles & Tailwind
```

## 🎨 Design System

### Color Palette
- **Primary**: Electric Cyan (#00F5FF)
- **Secondary**: Deep Magenta (#FF00FF)
- **Accent**: Vibrant Yellow (#FFD700)
- **Background**: Near-black (#0A0A0F)
- **Card**: Dark gray (#151520)

### Button Variants
- `hero`: Large gradient button with glow effect
- `accent`: Secondary gradient style
- `ghost`: Transparent with border
- `outline`: Outlined style

### Custom Classes
- `card-glass`: Glassmorphism card effect
- `card-gradient`: Gradient background card
- `text-gradient-*`: Text with gradient effects
- `badge-*`: Various badge styles

## 🔌 Backend Integration

The app is designed to easily integrate with a real backend. All API calls are centralized in `src/services/api.ts`:



### API Endpoints Expected:

```
GET    /categories
GET    /categories/:slug
GET    /products?category=&search=&sort=
GET    /products/:id
GET    /products/:slug
POST   /auth/login
POST   /auth/signup
POST   /auth/logout
GET    /auth/me
POST   /orders
GET    /orders
GET    /orders/:id
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📦 Key Dependencies

- **react**: UI library
- **react-router-dom**: Routing
- **typescript**: Type safety
- **tailwindcss**: Styling
- **framer-motion**: Animations
- **zustand**: State management
- **axios**: HTTP client
- **lucide-react**: Icons
- **react-hot-toast**: Notifications

## 🎯 Mock Data

The app includes realistic mock data for:
- **5 Categories**: Electronics, Clothing, Home & Garden, Sports, Books
- **15 Products**: Various products across all categories
- **User Authentication**: Mock login/signup
- **Orders**: Stored in localStorage for persistence

## 🔐 Authentication Flow

1. User signs in/signs up via `/auth`
2. Mock API returns user data and token
3. Token stored in localStorage
4. Zustand store updated with user state
5. Axios interceptor adds token to subsequent requests
6. Protected routes check authentication status

## 🛒 Shopping Flow

1. Browse products on home or products page
2. View product details
3. Add items to cart (requires authentication)
4. Review cart and update quantities
5. Proceed to checkout
6. Fill shipping information
7. Place order (creates mock order)
8. View order confirmation and history

## 📱 Responsive Design

- **Mobile**: Hamburger menu, stacked layouts
- **Tablet**: 2-column grids, compact navigation
- **Desktop**: Full navigation, 4-column grids

## 🎨 Animations

- **Page transitions**: Fade in on route change
- **Product cards**: Staggered reveal
- **Hover effects**: Scale and glow
- **Loading states**: Pulse animations
- **Cart badge**: Bounce on add

## 🚧 Future Enhancements

- [ ] Connect to real backend API
- [ ] Implement Stripe payment integration
- [ ] Add product reviews system
- [ ] Implement wishlist functionality
- [ ] Add admin dashboard
- [ ] Enable product search
- [ ] Add filters by price range
- [ ] Implement pagination

## 📝 License

This project is open source and available for portfolio use.

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize for your own use!

---

Built with ❤️ using React, TypeScript & Tailwind CSS
