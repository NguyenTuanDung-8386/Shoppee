# 🛍️ Shoppee — Full-Stack E-Commerce

A full-stack e-commerce demo inspired by Shopee, built with **React + Vite + Tailwind CSS** (frontend) and **Django REST Framework** (backend), using **MySQL** and **JWT authentication**.

---

## 📁 Project Structure

```
shoppee/
├── backend/                        # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env                        # Environment variables
│   ├── shoppee_project/            # Django project config
│   │   ├── settings.py
│   │   └── urls.py
│   ├── apps/
│   │   ├── users/                  # Auth, JWT, user profile
│   │   ├── products/               # Products, categories, reviews
│   │   ├── cart/                   # Shopping cart
│   │   └── orders/                 # Orders & order items
│   └── fixtures/
│       └── categories.json
│
└── frontend/                       # React + Vite
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                  # Routes
        ├── api/axios.js             # Axios + JWT interceptors
        ├── context/
        │   ├── AuthContext.jsx      # Auth state
        │   └── CartContext.jsx      # Cart state
        ├── components/
        │   ├── layout/             # Navbar, Footer, Layout
        │   ├── product/            # ProductCard
        │   └── common/             # UI helpers, ProtectedRoute
        └── pages/
            ├── Home.jsx
            ├── Login.jsx / Register.jsx
            ├── Products.jsx         # List + filter + search
            ├── ProductDetail.jsx    # Detail + reviews
            ├── Cart.jsx
            ├── Checkout.jsx
            ├── Orders.jsx
            ├── Profile.jsx
            ├── MyProducts.jsx       # Seller management
            └── ProductForm.jsx      # Create / edit product
```

---

## 🗄️ Database Schema

| Table          | Key Columns                                                     |
|----------------|-----------------------------------------------------------------|
| `users`        | id, email, username, phone, avatar, address, is_seller          |
| `categories`   | id, name, slug, icon                                            |
| `products`     | id, seller_id, category_id, name, price, original_price, stock, sold, rating |
| `product_images` | id, product_id, image, order                                  |
| `reviews`      | id, product_id, user_id, rating, comment                        |
| `cart_items`   | id, user_id, product_id, quantity                               |
| `orders`       | id, user_id, total_price, status, shipping_address, note        |
| `order_items`  | id, order_id, product_id, product_name, quantity, price         |

---

## 🔌 API Endpoints

### Auth
| Method   | Endpoint                    | Description         |
|----------|-----------------------------|---------------------|
| POST     | `/api/auth/register/`       | Register            |
| POST     | `/api/auth/login/`          | Login → JWT tokens  |
| POST     | `/api/auth/token/refresh/`  | Refresh access token|
| GET      | `/api/auth/me/`             | Current user        |
| GET/PUT  | `/api/auth/profile/`        | View/update profile |

### Products
| Method        | Endpoint                          | Description                   |
|---------------|-----------------------------------|-------------------------------|
| GET           | `/api/products/`                  | List (search, filter, paginate)|
| POST          | `/api/products/`                  | Create product (auth)         |
| GET           | `/api/products/{id}/`             | Product detail + reviews      |
| PUT/PATCH     | `/api/products/{id}/`             | Update product (owner)        |
| DELETE        | `/api/products/{id}/`             | Delete product (owner)        |
| GET           | `/api/products/featured/`         | Top selling products          |
| GET           | `/api/products/my_products/`      | Seller's own products         |
| POST          | `/api/products/{id}/review/`      | Submit review                 |
| GET           | `/api/products/categories/`       | All categories                |

### Cart
| Method   | Endpoint           | Description             |
|----------|--------------------|-------------------------|
| GET      | `/api/cart/`       | View cart + total       |
| POST     | `/api/cart/`       | Add item to cart        |
| PUT      | `/api/cart/{id}/`  | Update item quantity    |
| DELETE   | `/api/cart/{id}/`  | Remove item             |
| DELETE   | `/api/cart/clear/` | Clear entire cart       |

### Orders
| Method   | Endpoint             | Description              |
|----------|----------------------|--------------------------|
| GET      | `/api/orders/`       | List user's orders       |
| POST     | `/api/orders/`       | Place order from cart    |
| GET      | `/api/orders/{id}/`  | Order detail             |
| PATCH    | `/api/orders/{id}/`  | Update status            |

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8+

### 1. MySQL Setup
```sql
CREATE DATABASE shoppee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (edit .env with your DB credentials)
cp .env.example .env

# Run migrations
python manage.py makemigrations users products cart orders
python manage.py migrate

# Load category fixtures
python manage.py loaddata fixtures/categories.json

# Seed demo data (creates demo accounts + 20 sample products)
python manage.py seed_demo

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend

npm install
npm run dev
```

---

## 🚀 Run Commands

```bash
# Backend  →  http://localhost:8000
cd backend && python manage.py runserver

# Frontend →  http://localhost:5173
cd frontend && npm run dev

# Admin panel  →  http://localhost:8000/admin/
```

---

## 🔑 Demo Credentials (after seed_demo)

| Role   | Email               | Password   |
|--------|---------------------|------------|
| Seller | seller@demo.com     | demo1234   |
| Buyer  | buyer@demo.com      | demo1234   |

---

## ✅ Features

- **JWT Authentication** — register, login, auto token refresh
- **Product CRUD** — create, read, update, delete (seller-owned)
- **Search & Filter** — by name, category, price range
- **Sort** — newest, best selling, top rated, price
- **Shopping Cart** — add, update quantity, remove, clear
- **Checkout & Orders** — place order, view history, cancel pending
- **Reviews** — star rating + comment, one per user per product
- **Responsive UI** — mobile-first Shopee-inspired design
- **Seller Dashboard** — manage products with stock tracking
- **Admin Panel** — full Django admin at `/admin/`

---

## 🧪 Testing Steps

1. Visit `http://localhost:5173`
2. Register a new account or use demo credentials
3. Browse products, use search bar and category filters
4. Click a product → view details + reviews
5. Adjust quantity → Add to Cart
6. Go to Cart → Proceed to Checkout
7. Fill shipping address → Place Order
8. Check Orders page for order history
9. Login as `seller@demo.com` → go to My Products
10. Add / edit / delete products
11. Visit `http://localhost:8000/admin/` for Django admin
