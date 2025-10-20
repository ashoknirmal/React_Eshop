React E-Shop Project

A full-stack e-commerce web application built with React.js (Vite) for the frontend and JSON Server (on Render) as a mock backend. The app includes features like product listing, cart, wishlist, and admin dashboard.

Admin Credentials
Role	Email	Password
Admin	admin@example.com	admin123

Use the admin email to access admin features like managing orders and products.

Features

Browse products by category

Add products to cart and wishlist

Admin dashboard for managing orders

User authentication via Google Login (Firebase)

Responsive design with Vite + TailwindCSS

Hosted on Vercel (frontend) and Render (backend API)

Tech Stack

Frontend: React.js (Vite), TailwindCSS, Framer Motion

Backend: JSON Server, Node.js (deployed on Render)

Authentication: Firebase Google Login

Deployment: Vercel (frontend), Render (backend API)

Project Structure
React_Eshop/
├── api/
│   ├── server.js         # Custom JSON Server backend
│   ├── db.json           # Sample data
│   └── package.json      # Dependencies for backend
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Pages (Product, Cart, Dashboard)
    │   └── App.jsx       # Main App
    ├── package.json       # Frontend dependencies
    └── vite.config.js     # Vite config

Setup Instructions (Local Development)
Backend (API)

Go to API folder:

cd api


Install dependencies:

npm install


Start server:

npm start


JSON Server will run at http://localhost:5000

Endpoints: /products, /orders, /carts, etc.

Frontend

Go to frontend folder:

cd frontend


Install dependencies:

npm install


Start frontend:

npm run dev


Vite will serve frontend at http://localhost:5173 (or specified port)

Frontend fetches products from VITE_API_BASE_URL defined in .env

Environment Variables

Create .env in frontend/ with the following:

VITE_API_BASE_URL=https://eshop-api-ibpx.onrender.com
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=admin123  # Optional if using local login


Make sure these variables are set in Vercel when deploying frontend.

Deployment
Backend (Render)

Push api/ folder to GitHub.

Create a Render Web Service.

Root directory: api

Build command: npm install

Start command: npm start

Render will provide your API URL (used in VITE_API_BASE_URL).

Frontend (Vercel)

Push frontend/ to GitHub.

Import project on Vercel
.

Root directory: frontend

Build command: npm run build

Output directory: dist

Add environment variables from .env (VITE_API_BASE_URL, Firebase keys, admin credentials)

Deploy and access your frontend URL.

Usage

Open frontend URL (e.g., https://your-frontend.vercel.app).

Browse products and add to cart/wishlist.

Sign in with Google Login.

Use admin email (admin@example.com) to access admin features.

Contributing

Fork repo and create a branch for your feature

Submit a pull request

Ensure code runs without errors on both frontend and backend

License

MIT License © Ashok Nirmal
