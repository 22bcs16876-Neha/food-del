# 🍔 Food Delivery Web Application

A full-stack Food Delivery application built using the **MERN Stack**. The project includes a customer-facing website, an admin dashboard for managing food items and orders, and a backend API with authentication, database integration, and Stripe payment support.

## 📂 Project Structure

```
food-del/
│── frontend/        # Customer website
│── admin/           # Admin dashboard
│── backend/         # Express.js REST API
└── .gitignore
```

---

## 🚀 Features

### 👤 Customer
- Browse food items
- Add and remove items from cart
- User authentication (Register/Login)
- Place food orders
- Secure online payment with Stripe
- View order details

### 🛠️ Admin
- Admin dashboard
- Add new food items
- Upload food images
- Delete food items
- Manage customer orders
- Update order status

### ⚙️ Backend
- RESTful APIs
- MongoDB database integration
- JWT Authentication
- Image upload using Multer
- Stripe Payment Gateway
- Cart management
- Order management

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios

### Admin Panel
- React
- Vite
- Axios
- React Toastify
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Stripe
- Bcrypt
- Validator
- CORS

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/food-del.git
cd food-del
```

---

### 2. Install dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Admin

```bash
cd ../admin
npm install
```

#### Backend

```bash
cd ../backend
npm install
```

---

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm run server
```

Server runs on:

```
http://localhost:4000
```

---

### Start Frontend

```bash
cd frontend
npm run dev
```

---

### Start Admin Panel

```bash
cd admin
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## 📡 API Routes

| Route | Description |
|--------|-------------|
| `/api/user` | User Authentication |
| `/api/food` | Food Management |
| `/api/cart` | Shopping Cart |
| `/api/order` | Order Management |
| `/images` | Uploaded Images |

---

## 📸 Screens

- Customer Website
- Admin Dashboard
- Food Listing
- Shopping Cart
- Checkout
- Order Management

---

## Future Improvements

- Email Notifications
- Order Tracking
- Product Search
- Wishlist
- Reviews & Ratings
- Responsive UI Enhancements

---

## 👩‍💻 Author

**Neha Kumari Nandini**

GitHub: https://github.com/<your-username>

---

## 📄 License

This project is developed for learning and portfolio purposes.
