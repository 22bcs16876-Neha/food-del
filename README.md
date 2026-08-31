<div align="center">

# 🍔 Food Delivery Web Application

A full-stack **Food Delivery** application built with the **MERN Stack** — a customer-facing website, an admin dashboard for managing food items and orders, and a backend REST API with authentication, database integration, and Stripe payment support.

<p>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/github/stars/22bcs16876-Neha/food-del?style=flat-square&color=7C6CFF" />
  <img src="https://img.shields.io/github/forks/22bcs16876-Neha/food-del?style=flat-square&color=7C6CFF" />
  <img src="https://img.shields.io/github/last-commit/22bcs16876-Neha/food-del?style=flat-square&color=7C6CFF" />
  <img src="https://img.shields.io/badge/license-Educational-lightgrey?style=flat-square" />
</p>

</div>

<br/>

## 📖 Table of Contents

- [Project Structure](#-project-structure)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Installation](#-installation)
- [Running the Project](#️-running-the-project)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Screens](#-screens)
- [Future Improvements](#-future-improvements)
- [Author](#-author)
- [License](#-license)

<br/>

## 📂 Project Structure

```
food-del/
│── frontend/        # Customer website (React + Vite)
│── admin/           # Admin dashboard (React + Vite)
│── backend/         # Express.js REST API
└── .gitignore
```

<br/>

## 🚀 Features

<table>
<tr>
<td width="33%" valign="top">

### 👤 Customer
- Browse food items
- Add / remove items from cart
- User authentication (Register / Login)
- Place food orders
- Secure online payment via Stripe
- View order details

</td>
<td width="33%" valign="top">

### 🛠️ Admin
- Admin dashboard
- Add new food items
- Upload food images
- Delete food items
- Manage customer orders
- Update order status

</td>
<td width="33%" valign="top">

### ⚙️ Backend
- RESTful APIs
- MongoDB database integration
- JWT authentication
- Image upload via Multer
- Stripe payment gateway
- Cart & order management

</td>
</tr>
</table>

<br/>

## 🛠️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,js,nodejs,express,mongodb,html,css&perline=8" />

</div>

| Layer | Stack |
|---|---|
| **Frontend** | React, Vite, React Router DOM, Axios |
| **Admin Panel** | React, Vite, Axios, React Toastify, React Hot Toast |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Stripe, Bcrypt, Validator, CORS |

<br/>

## 📦 Installation

**1. Clone the repository**
```bash
git clone https://github.com/22bcs16876-Neha/food-del.git
cd food-del
```

**2. Install dependencies**

Frontend
```bash
cd frontend
npm install
```

Admin
```bash
cd ../admin
npm install
```

Backend
```bash
cd ../backend
npm install
```

<br/>

## ▶️ Running the Project

**Start Backend**
```bash
cd backend
npm run server
```
Server runs on: `http://localhost:4000`

**Start Frontend**
```bash
cd frontend
npm run dev
```

**Start Admin Panel**
```bash
cd admin
npm run dev
```

<br/>

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

<br/>

## 📡 API Routes

| Route | Description |
|---|---|
| `/api/user` | User authentication |
| `/api/food` | Food management |
| `/api/cart` | Shopping cart |
| `/api/order` | Order management |
| `/images` | Uploaded images |

<br/>

## 📸 Screens

> Add real screenshots here — drop image files into a `/screenshots` folder in the repo and reference them like below. This is the single biggest thing that makes a project README look finished.

| Customer Website | Admin Dashboard |
|---|---|
| `![Customer Website](./screenshots/customer-home.png)` | `![Admin Dashboard](./screenshots/admin-dashboard.png)` |

| Food Listing | Shopping Cart |
|---|---|
| `![Food Listing](./screenshots/food-listing.png)` | `![Shopping Cart](./screenshots/cart.png)` |

| Checkout | Order Management |
|---|---|
| `![Checkout](./screenshots/checkout.png)` | `![Order Management](./screenshots/order-management.png)` |

<br/>

## 🔮 Future Improvements

- [ ] Email notifications
- [ ] Order tracking
- [ ] Product search
- [ ] Wishlist
- [ ] Reviews & ratings
- [ ] Responsive UI enhancements

<br/>

## 👩‍💻 Author

**Neha Kumari Nandini**

<p>
  <a href="https://github.com/22bcs16876-Neha">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/neha-k-nandini/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
</p>

<br/>

## 📄 License

This project is developed for learning and portfolio purposes.
