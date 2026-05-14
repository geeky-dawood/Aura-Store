# VOGUE - Modern eCommerce Platform

A premium, state-of-the-art eCommerce platform built with Next.js 14+, TypeScript, and Tailwind CSS, fully integrated with the provided backend APIs.

## 🚀 Tech Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **API Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## ✨ Key Features

- **Authentication**: Fully functional Signup/Login with JWT persistence.
- **Product Catalog**: Dynamic listing, search, and detailed views with skeleton loaders.
- **Shopping Cart**: Persistent cart with real-time updates and subtotal calculations.
- **Checkout Flow**: Multi-step checkout with address management and Stripe integration logic.
- **User Profile**: Dashboard for managing personal info and order history.
- **Admin Dashboard**: Comprehensive view for managing products and tracking orders.
- **Premium UI**: Glassmorphism effects, smooth transitions, and responsive mobile-first design.

## 🛠️ Getting Started

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file based on `.env.example`:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/api`: Modular API service functions.
- `src/app`: Page routes and layouts.
- `src/components`: Reusable UI and feature-specific components.
- `src/store`: Global state management with Zustand.
- `src/types`: Centralized TypeScript interfaces.
- `src/utils`: Helper functions and styling utilities.

## 📦 API Integration Details

All endpoints from the Postman collection have been mapped to services in `src/api/`. Bearer token authentication is automatically handled via Axios interceptors in `src/lib/api-client.ts`.
