```jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminOrderDetails.css";

import {
  ArrowLeft,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";

const API_URL =
  "https://sp-fancy-backend-1.onrender.com/api/admin/orders";

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const getAdminToken = () =>
    localStorage.getItem("spFancyAdminToken");

  const getErrorMessage = (err, fallback) => {
    const status = err.response?.status;
    const message =
      err.response?.data?.message || err.message || fallback;

    if (status) {
      return `Error ${status}: ${message}`;
    }

    return message || fallback;
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const response = await axios.get(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(response.data);
    } catch (err) {
      console.error("Fetch admin order error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("spFancyAdminToken");
        localStorage.removeItem("spFancyAdmin");
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(getErrorMessage(err, "Unable to load order."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const response = await axios.put(
        `${API_URL}/${id}/status`,
        {
          orderStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(response.data.order);
      alert(`Order status changed to ${newStatus}`);
    } catch (err) {
      console.error("Update status error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("spFancyAdminToken");
        localStorage.removeItem("spFancyAdmin");
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(
        getErrorMessage(err, "Unable to update order status.")
      );
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          <div className="admin-loading">
            Loading order details...
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          <div className="admin-page-error">
            {error || "Order not found."}
          </div>

          <button
            className="admin-back-btn"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft size={16} />
            BACK TO ORDERS
          </button>
        </main>
      </div>
    );
  }

  const status = order.orderStatus || "placed";

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-main-header">
          <div>
            <p className="section-label">SP FANCY • ORDERS</p>
            <h1>Order Details</h1>
            <p>
              Order #
              {order._id.slice(-8).toUpperCase()}
            </p>
          </div>

          <button
            className="admin-back-btn"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft size={16} />
            BACK TO ORDERS
          </button>
        </header>

        {error && (
          <div className="admin-page-error">{error}</div>
        )}

        <section className="admin-status-management">
          <div className="admin-status-heading">
            <div>
              <p className="section-label">ORDER STATUS</p>
              <h2>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </h2>
            </div>

            <div
              className={`admin-current-status status-${status}`}
            >
              {status.toUpperCase()}
            </div>
          </div>

          <div className="admin-status-actions">
            <button
              className="admin-status-btn confirm"
              disabled={updating || status !== "placed"}
              onClick={() => updateStatus("confirmed")}
            >
              <CheckCircle size={17} />
              CONFIRM ORDER
            </button>

            <button
              className="admin-status-btn ship"
              disabled={updating || status !== "confirmed"}
              onClick={() => updateStatus("shipped")}
            >
              <Truck size={17} />
              MARK SHIPPED
            </button>

            <button
              className="admin-status-btn deliver"
              disabled={updating || status !== "shipped"}
              onClick={() => updateStatus("delivered")}
            >
              <CheckCircle size={17} />
              MARK DELIVERED
            </button>

            <button
              className="admin-status-btn cancel"
              disabled={
                updating ||
                status === "delivered" ||
                status === "cancelled"
              }
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to cancel this order?"
                );

                if (confirmed) {
                  updateStatus("cancelled");
                }
              }}
            >
              <XCircle size={17} />
              CANCEL ORDER
            </button>
          </div>
        </section>

        <section className="admin-order-details-grid">
          <div className="admin-order-detail-card">
            <div className="admin-order-detail-title">
              <div className="admin-order-detail-icon">
                <Package size={20} />
              </div>
              <div>
                <h2>Order Summary</h2>
                <p>Basic order information</p>
              </div>
            </div>

            <div className="admin-order-info-list">
              <div>
                <span>Order ID</span>
                <strong>#{order._id}</strong>
              </div>
              <div>
                <span>Order Date</span>
                <strong>{formatDate(order.createdAt)}</strong>
              </div>
              <div>
                <span>Payment</span>
                <strong>
                  {order.paymentMethod?.toUpperCase() || "COD"}
                </strong>
              </div>
              <div>
                <span>Payment Status</span>
                <strong>{order.paymentStatus || "pending"}</strong>
              </div>
            </div>
          </div>

          <div className="admin-order-detail-card">
            <div className="admin-order-detail-title">
              <div className="admin-order-detail-icon">
                <User size={20} />
              </div>
              <div>
                <h2>Customer</h2>
                <p>Customer contact details</p>
              </div>
            </div>

            <div className="admin-customer-details">
              <div>
                <User size={17} />
                <span>{order.customer?.fullName || "N/A"}</span>
              </div>
              <div>
                <Phone size={17} />
                <span>{order.customer?.phone || "N/A"}</span>
              </div>
              <div>
                <Mail size={17} />
                <span>{order.customer?.email || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="admin-order-detail-card">
            <div className="admin-order-detail-title">
              <div className="admin-order-detail-icon">
                <MapPin size={20} />
              </div>
              <div>
                <h2>Delivery Address</h2>
                <p>Customer shipping address</p>
              </div>
            </div>

            <div className="admin-address-box">
              <p>{order.shippingAddress?.address || "N/A"}</p>
              <p>
                {order.shippingAddress?.city || ""}
                {order.shippingAddress?.city &&
                order.shippingAddress?.state
                  ? ", "
                  : ""}
                {order.shippingAddress?.state || ""}
              </p>
              <p>{order.shippingAddress?.pincode || ""}</p>
            </div>
          </div>

          <div className="admin-order-detail-card">
            <div className="admin-order-detail-title">
              <div className="admin-order-detail-icon">
                <CreditCard size={20} />
              </div>
              <div>
                <h2>Payment</h2>
                <p>Payment information</p>
              </div>
            </div>

            <div className="admin-payment-box">
              <div>
                <span>Payment Method</span>
                <strong>
                  {order.paymentMethod?.toUpperCase() || "COD"}
                </strong>
              </div>
              <div>
                <span>Payment Status</span>
                <strong>{order.paymentStatus || "pending"}</strong>
              </div>
            </div>
          </div>

          <div className="admin-order-products-card">
            <div className="admin-order-detail-title">
              <div className="admin-order-detail-icon">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2>Ordered Products</h2>
                <p>{order.items?.length || 0} product(s)</p>
              </div>
            </div>

            <div className="admin-order-items">
              {order.items?.map((item, index) => (
                <div
                  className="admin-order-item"
                  key={item._id || index}
                >
                  <div className="admin-order-item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  <div className="admin-order-item-info">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <span>
                      ₹{item.price} × {item.quantity}
                    </span>
                  </div>

                  <strong className="admin-order-item-total">
                    ₹
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 0)
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-order-total-card">
            <div>
              <span>Subtotal</span>
              <strong>
                ₹{Number(order.subtotal || 0).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Delivery Charge</span>
              <strong>
                ₹
                {Number(order.deliveryCharge || 0).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div className="admin-order-grand-total">
              <span>Total Amount</span>
              <strong>
                ₹
                {Number(order.totalAmount || 0).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminOrderDetails;
```
