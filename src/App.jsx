import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminCustomers from "./pages/AdminCustomers";
import Profile from "./pages/Profile";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";


function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("spFancyLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function AdminProtectedRoute({ children }) {
  const adminToken =
    localStorage.getItem("spFancyAdminToken");

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}


function Layout() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/admin/login";

  const isAdminPage =
    location.pathname.startsWith("/admin");

  return (
    <>
      {!isAuthPage && !isAdminPage && <Navbar />}

      <Routes>

        {/* =========================
            CUSTOMER AUTH
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            ADMIN AUTH
        ========================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =========================
            ADMIN DASHBOARD
        ========================= */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
  path="/admin/products"
  element={
    <AdminProtectedRoute>
      <AdminProducts />
    </AdminProtectedRoute>
  }
/>
<Route
  path="/admin/products/add"
  element={
    <AdminProtectedRoute>
      <AdminAddProduct />
    </AdminProtectedRoute>
  }
/>
<Route
  path="/admin/products/edit/:id"
  element={
    <AdminProtectedRoute>
      <AdminEditProduct />
    </AdminProtectedRoute>
  }
/>
<Route
  path="/admin/orders"
  element={
    <AdminProtectedRoute>
      <AdminOrders />
    </AdminProtectedRoute>
  }
/>
<Route
  path="/admin/orders/:id"
  element={
    <AdminProtectedRoute>
      <AdminOrderDetails />
    </AdminProtectedRoute>
  }
/>
<Route
  path="/admin/customers"
  element={
    <AdminProtectedRoute>
      <AdminCustomers />
    </AdminProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

        {/* =========================
            CUSTOMER HOME
        ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />


        {/* =========================
            CUSTOMER SHOP
        ========================= */}

        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />


        {/* =========================
            CART
        ========================= */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />


        {/* =========================
            WISHLIST
        ========================= */}

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />


        {/* =========================
            CHECKOUT
        ========================= */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />


        {/* =========================
            ORDER SUCCESS
        ========================= */}

        <Route
          path="/order-success/:id"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />


        {/* =========================
            MY ORDERS
        ========================= */}

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />


        {/* =========================
            UNKNOWN ROUTE
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </>
  );
}


function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;