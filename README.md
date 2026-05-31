# Restaurant Management System (RMS) - Frontend

This is a modern, high-performance web application built with **Next.js 14** for managing restaurant operations. It features a sleek, premium dark-themed UI and integrates seamlessly with a microservices-based backend (Identity and Restaurant services).

## 🚀 Features

- **Advanced Authentication**: Full JWT-based flow with secure role-based access control (Admin, Manager, Waiter).
- **Force Password Change**: Automatic detection of first-time logins, forcing users to update their credentials before accessing the system.
- **Dynamic Menu Management**: Real-time CRUD operations for menu categories and items.
- **Table & Floor Management**: Visual grid representation of restaurant tables with real-time status indicators (Free/Occupied).
- **Order Processing**: Optimized modal-based interface for waiters to quickly create and manage customer orders.
- **Staff Management**: Admin dashboard for registering new employees, assigning roles, and managing the team.
- **Premium UI/UX**: Built with a "Carbon/Amber" aesthetic using Tailwind CSS, featuring smooth transitions and responsive design.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management & API**: [Axios](https://axios-http.com/) with custom Interceptors for multi-service JWT injection.
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Icons & UI**: Lucide React & Custom SVG components.
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## ⚙️ Setup & Installation

### 1. Prerequisites

- Node.js (v18.0 or higher)
- npm or yarn

### 2. Environment Variables

Create a `.env.local` file in the root directory and add your backend service URLs:

```env
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8081/api
NEXT_PUBLIC_RESTAURANT_API_URL=http://localhost:8082/api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## 🏗️ Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (Modals, Forms, Tables).
- `src/services`: API service layers for communicating with different microservices.
- `src/lib`: Shared configurations (Axios instances, Auth helpers).
- `src/types`: TypeScript interfaces for API requests and responses.

## 🔒 Security Implementation

The application uses a Dual-Interceptor Strategy to manage authentication across microservices:

1. Identity Service Interceptor: Handles login, registration, and user management.
2. Restaurant Service Interceptor: Manages orders, menu, and tables. Both interceptors automatically inject the JWT token from localStorage into the Authorization header for every request.
