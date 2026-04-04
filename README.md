# 🧶 CrochetBloom

A full-stack e-commerce store for handmade crochet products — mini bouquets, keychains, and flowers. Built with React + Node.js and deployed on Render.

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v7
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multer + Cloudinary (image uploads)
- bcryptjs (password hashing)

---

## Project Structure

```
crochet-store/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT protect + adminOnly
│   │   └── upload.js        # Multer memory + Cloudinary stream
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── auth.js          # Register, Login
│   │   ├── products.js      # Get all / single product
│   │   ├── orders.js        # Place order, my orders
│   │   ├── categories.js    # CRUD categories
│   │   ├── admin.js         # Stats, orders, users, products, inventory, transactions
│   │   └── profile.js       # Get/update profile, change password, avatar upload
│   ├── seedAdmin.js         # Auto-creates admin on startup
│   └── server.js
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.jsx   # Login state + localStorage
        │   └── CartContext.jsx   # Cart state (in-memory)
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProductCard.jsx
        └── pages/
            ├── Home, Shop, ProductDetail, Cart
            ├── Login, Register, Checkout, OrderSuccess
            ├── MyOrders, Profile
            └── admin/
                ├── AdminDashboard, AdminProducts, AdminCategories
                ├── AdminOrders, AdminUsers, AdminTransactions, AdminInventory
                └── AdminLayout
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourpassword
ADMIN_NAME=Admin
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend proxies `/api` requests to `http://localhost:5000` in development (configured in `vite.config.js`).

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/products` | — | Get all products (optional `?category=`) |
| GET | `/api/products/:id` | — | Get single product |
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders/myorders` | User | Get my orders |
| GET | `/api/profile` | User | Get profile |
| PUT | `/api/profile` | User | Update name/phone/address |
| PUT | `/api/profile/password` | User | Change password |
| POST | `/api/profile/avatar` | User | Upload avatar |
| POST | `/api/upload` | Admin | Upload product images to Cloudinary |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET/PUT/DELETE | `/api/admin/orders/:id` | Admin | Manage orders |
| GET/PUT/DELETE | `/api/admin/users/:id` | Admin | Manage users |
| POST/PUT/DELETE | `/api/admin/products/:id` | Admin | Manage products |
| GET | `/api/admin/transactions` | Admin | View transactions |
| GET/PUT | `/api/admin/inventory/:id` | Admin | View/update stock |
| GET/POST/PUT/DELETE | `/api/categories` | Admin | Manage categories |
| GET | `/api/health` | — | Health check |

---

## Features

**Store**
- Browse products by category (bouquets, keychains, flowers)
- Product detail page with image gallery
- Cart with quantity management
- Checkout with shipping details
- Cash on delivery / online payment options
- Order tracking with status steps (Processing → Packed → Shipped → Delivered)

**Auth**
- Register / Login with JWT (7-day expiry)
- Protected routes for checkout, orders, profile
- User profile with avatar upload

**Admin Panel** (`/admin`)
- Dashboard with revenue, order, and user stats
- Product management with multi-image upload (up to 10 images)
- Order management with status updates
- User management (toggle admin, delete)
- Inventory management with stock levels
- Transaction history

---

## Image Uploads

Images are stored on Cloudinary (not the server filesystem). The upload flow:

1. File selected in admin panel
2. Sent to `POST /api/upload` as `multipart/form-data`
3. Multer holds it in memory
4. Streamed to Cloudinary folder `crochet-store`, auto-resized to 800px width
5. Cloudinary returns a `secure_url` stored in the database

---

## Deployment (Render)

The project includes a `render.yaml` blueprint for one-click deployment.

**Services deployed:**
- `crochet-store-backend` — Node.js web service
- `crochet-store-frontend` — Static site (Vite build)

**Steps:**
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint → connect repo → select `render.yaml`
3. Set these environment variables manually in the Render dashboard:

| Service | Variable | Value |
|---------|----------|-------|
| Backend | `MONGO_URI` | MongoDB Atlas connection string |
| Backend | `JWT_SECRET` | Any strong secret string |
| Backend | `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| Frontend | `VITE_API_URL` | Your backend Render URL |

> `VITE_API_URL` is baked into the frontend at build time by Vite — the frontend must be rebuilt after changing it.

---

## Environment Variables Summary

**Backend**

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `PORT` | Server port (default 5000) |
| `ADMIN_EMAIL` | Auto-seeded admin email |
| `ADMIN_PASSWORD` | Auto-seeded admin password |
| `ADMIN_NAME` | Auto-seeded admin name |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

**Frontend**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL (e.g. `https://your-backend.onrender.com`) |
