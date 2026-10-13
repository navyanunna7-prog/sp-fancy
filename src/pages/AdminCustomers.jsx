
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Search,
  ShoppingBag,
  IndianRupee,
  Mail,
  Phone,
  Eye,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminCustomers.css";

function AdminCustomers() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem("spFancyAdminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
       const response = await axios.get(
  "https://sp-fancy-backend-1.onrender.com/api/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("spFancyAdminToken");
          localStorage.removeItem("spFancyAdmin");
          navigate("/admin/login");
        } else {
          setError("Unable to load customers. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [navigate]);

  const customers = useMemo(() => {
    const customerMap = new Map();

    orders.forEach((order) => {
      const customer = order.customer;

      if (!customer) return;

      const email = (customer.email || "").trim().toLowerCase();
      const key = email || order.userId?.toString();

      if (!key) return;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name: customer.fullName || "Customer",
          email: customer.email || "—",
          phone: customer.phone || "—",
          totalOrders: 0,
          totalSpent: 0,
          latestOrder: order.createdAt,
        });
      }

      const existing = customerMap.get(key);

      existing.totalOrders += 1;
      existing.totalSpent += Number(order.totalAmount) || 0;

      if (
        order.createdAt &&
        (!existing.latestOrder ||
          new Date(order.createdAt) > new Date(existing.latestOrder))
      ) {
        existing.latestOrder = order.createdAt;
        existing.name = customer.fullName || existing.name;
        existing.email = customer.email || existing.email;
        existing.phone = customer.phone || existing.phone;
      }
    });

    return Array.from(customerMap.values()).sort(
      (a, b) => new Date(b.latestOrder || 0) - new Date(a.latestOrder || 0)
    );
  }, [orders]);

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    );
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-customers-layout">
      <AdminSidebar />

      <main className="admin-customers-main">
        <div className="admin-customers-heading">
          <div>
            <span className="admin-customers-eyebrow">SP FANCY ADMIN</span>
            <h1>Customers</h1>
            <p>Manage and review your store customers.</p>
          </div>

          <div className="admin-customers-heading-icon">
            <Users size={26} />
          </div>
        </div>

        <div className="admin-customers-stats">
          <div className="admin-customer-stat">
            <div className="admin-customer-stat-icon">
              <Users size={22} />
            </div>
            <div>
              <p>Total Customers</p>
              <h2>{customers.length}</h2>
            </div>
          </div>

          <div className="admin-customer-stat">
            <div className="admin-customer-stat-icon">
              <ShoppingBag size={22} />
            </div>
            <div>
              <p>Total Orders</p>
              <h2>{orders.length}</h2>
            </div>
          </div>

          <div className="admin-customer-stat">
            <div className="admin-customer-stat-icon">
              <IndianRupee size={22} />
            </div>
            <div>
              <p>Total Order Value</p>
              <h2>{formatCurrency(
                orders.reduce(
                  (total, order) => total + (Number(order.totalAmount) || 0),
                  0
                )
              )}</h2>
            </div>
          </div>
        </div>

        <section className="admin-customers-panel">
          <div className="admin-customers-panel-header">
            <div>
              <h2>Customer List</h2>
              <p>{filteredCustomers.length} customers found</p>
            </div>

            <div className="admin-customers-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="admin-customers-message">
              Loading customers...
            </div>
          ) : error ? (
            <div className="admin-customers-message admin-customers-error">
              {error}
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="admin-customers-message">
              {search
                ? "No customers match your search."
                : "No customers found yet. Customers will appear after placing an order."}
            </div>
          ) : (
            <div className="admin-customers-table-wrap">
              <table className="admin-customers-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact Details</th>
                    <th>Total Orders</th>
                    <th>Total Spent</th>
                    <th>Latest Order</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="admin-customer-profile">
                          <div className="admin-customer-avatar">
                            {(customer.name || "C")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <strong>{customer.name}</strong>
                        </div>
                      </td>

                      <td>
                        <div className="admin-customer-contact">
                          <span>
                            <Mail size={14} />
                            {customer.email}
                          </span>
                          <span>
                            <Phone size={14} />
                            {customer.phone}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="admin-customer-order-count">
                          {customer.totalOrders}
                        </span>
                      </td>

                      <td>
                        <strong className="admin-customer-spent">
                          {formatCurrency(customer.totalSpent)}
                        </strong>
                      </td>

                      <td>{formatDate(customer.latestOrder)}</td>

                      <td>
                        <button
                          className="admin-customer-view-btn"
                          onClick={() => navigate("/admin/orders")}
                          title="View all orders"
                        >
                          <Eye size={16} />
                          View Orders
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminCustomers;
