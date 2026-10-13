```jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("spFancyAdminToken");

        if (!token) {
          navigate("/admin/login");
          return;
        }

        if (!API_URL) {
          throw new Error("Backend API URL is not configured.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [productsResponse, ordersResponse] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/admin/orders`, config),
        ]);

        const products = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : Array.isArray(productsResponse.data?.products)
          ? productsResponse.data.products
          : [];

        const orders = Array.isArray(ordersResponse.data)
          ? ordersResponse.data
          : Array.isArray(ordersResponse.data?.orders)
          ? ordersResponse.data.orders
          : [];

        const customerKeys = new Set();

        orders.forEach((order) => {
          const email = order.customer?.email?.trim().toLowerCase();
          const userId = order.userId?.toString();
          const key = email || userId;

          if (key) {
            customerKeys.add(key);
          }
        });

        const revenue = orders
          .filter(
            (order) =>
              (order.orderStatus || "").toLowerCase() !== "cancelled"
          )
          .reduce(
            (total, order) =>
              total + (Number(order.totalAmount) || 0),
            0
          );

        if (!isMounted) return;

        setStats({
          products: products.length,
          orders: orders.length,
          customers: customerKeys.size,
          revenue,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        if (!isMounted) return;

        if (err.response?.status === 401) {
          localStorage.removeItem("spFancyAdminToken");
          localStorage.removeItem("spFancyAdmin");
          navigate("/admin/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load dashboard data."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-main-header">
          <div>
            <p className="section-label">SP FANCY</p>
            <h1>Dashboard</h1>
            <p>Welcome to your store administration panel.</p>
          </div>
        </header>

        {error && (
          <div className="admin-page-error">
            {error}
          </div>
        )}

        <section className="admin-stats-grid">
          <button
            type="button"
            className="admin-stat-card admin-stat-clickable"
            onClick={() => navigate("/admin/products")}
          >
            <div className="admin-stat-icon">
              <Package size={24} />
            </div>

            <div>
              <span>Total Products</span>
              <strong>{loading ? "..." : stats.products}</strong>
            </div>

            <ArrowRight size={20} className="admin-stat-arrow" />
          </button>

          <button
            type="button"
            className="admin-stat-card admin-stat-clickable"
            onClick={() => navigate("/admin/orders")}
          >
            <div className="admin-stat-icon">
              <ShoppingBag size={24} />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{loading ? "..." : stats.orders}</strong>
            </div>

            <ArrowRight size={20} className="admin-stat-arrow" />
          </button>

          <button
            type="button"
            className="admin-stat-card admin-stat-clickable"
            onClick={() => navigate("/admin/customers")}
          >
            <div className="admin-stat-icon">
              <Users size={24} />
            </div>

            <div>
              <span>Total Customers</span>
              <strong>{loading ? "..." : stats.customers}</strong>
            </div>

            <ArrowRight size={20} className="admin-stat-arrow" />
          </button>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <IndianRupee size={24} />
            </div>

            <div>
              <span>Total Revenue</span>
              <strong>
                {loading ? "..." : formatCurrency(stats.revenue)}
              </strong>
            </div>
          </div>
        </section>

        <section className="admin-dashboard-section">
          <div className="admin-section-heading">
            <div>
              <p className="section-label">QUICK ACTIONS</p>
              <h2>Manage Your Store</h2>
            </div>
          </div>

          <div className="admin-quick-actions">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
            >
              <Package size={20} />
              <span>Manage Products</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/orders")}
            >
              <ShoppingBag size={20} />
              <span>Manage Orders</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/customers")}
            >
              <Users size={20} />
              <span>Manage Customers</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
```
