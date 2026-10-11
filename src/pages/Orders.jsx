import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Package,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  RefreshCw,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import "./Orders.css";

const API_URL = "http://localhost:5000/api/orders";

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatStatus = (status) => {
  const labels = {
    placed: "Order Placed",
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[String(status || "").toLowerCase()] || "Order Placed";
};

const getStatusClass = (status) => {
  const normalized = String(status || "placed").toLowerCase();

  return [
    "placed",
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ].includes(normalized)
    ? normalized
    : "placed";
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("spFancyToken");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;

      const orderList = Array.isArray(result)
        ? result
        : Array.isArray(result?.orders)
          ? result.orders
          : [];

      setOrders(orderList);
    } catch (err) {
      console.error("Failed to fetch orders:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load your orders. Please check the server and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrder = (id) => {
    setExpandedOrder((current) => (current === id ? null : id));
  };

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-empty">
          <Package size={48} strokeWidth={1.3} />
          <p className="section-label">MY ORDERS</p>
          <h1>Loading Orders...</h1>
          <p>Please wait while we load your orders.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="orders-empty">
          <Package size={48} strokeWidth={1.3} />
          <p className="section-label">MY ORDERS</p>
          <h1>Unable to Load Orders</h1>
          <p>{error}</p>

          <div className="orders-empty-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={fetchOrders}
            >
              <RefreshCw size={16} />
              TRY AGAIN
            </button>

            <Link to="/shop" className="orders-secondary-btn">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-empty">
          <ShoppingBag size={52} strokeWidth={1.3} />
          <p className="section-label">YOUR ACCOUNT</p>
          <h1>No Orders Yet</h1>
          <p>Your placed orders will appear here.</p>

          <Link to="/shop" className="primary-btn">
            START SHOPPING
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-heading">
        <p className="section-label">YOUR ACCOUNT</p>
        <h1>My Orders</h1>
        <p>View your purchases and track order status.</p>
      </div>

      <section className="orders-list">
        {orders.map((order) => {
          const orderId = order._id || order.id;
          const items = Array.isArray(order.items) ? order.items : [];
          const customer = order.customer || {};
          const address = order.shippingAddress || {};
          const status = getStatusClass(order.orderStatus);
          const isExpanded = expandedOrder === orderId;

          return (
            <article className="order-card" key={orderId}>
              <div className="order-card-header">
                <div className="order-main-info">
                  <div className="order-icon">
                    <Package size={21} />
                  </div>

                  <div>
                    <p className="order-label">ORDER ID</p>
                    <strong>
                      #{String(orderId || "").slice(-10).toUpperCase()}
                    </strong>
                  </div>
                </div>

                <div className="order-date">
                  <span>ORDERED ON</span>
                  <strong>{formatDate(order.createdAt)}</strong>
                </div>

                <div className={`order-status ${status}`}>
                  {formatStatus(status)}
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-products">
                  {items.map((item, index) => (
                    <div
                      className="order-product"
                      key={`${item.productId?._id || item.productId || item.name}-${index}`}
                    >
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name || "Ordered product"}
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                      />

                      <div className="order-product-info">
                        <h3>{item.name || "Product"}</h3>
                        <p>Quantity: {item.quantity || 1}</p>
                        <strong>
                          {formatPrice(
                            Number(item.price || 0) *
                              Number(item.quantity || 1)
                          )}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary-row">
                  <div>
                    <span>PAYMENT METHOD</span>
                    <strong>
                      {String(order.paymentMethod || "cod").toLowerCase() ===
                      "cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </strong>
                  </div>

                  <div>
                    <span>PAYMENT STATUS</span>
                    <strong
                      className={`payment-status ${order.paymentStatus || "pending"}`}
                    >
                      {String(order.paymentStatus || "pending").toUpperCase()}
                    </strong>
                  </div>

                  <div>
                    <span>TOTAL AMOUNT</span>
                    <strong className="order-total">
                      {formatPrice(order.totalAmount)}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="order-details-btn"
                  onClick={() => toggleOrder(orderId)}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? "HIDE DETAILS" : "VIEW DETAILS"}

                  {isExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                {isExpanded && (
                  <div className="order-details">
                    <div className="order-detail-section">
                      <h3 className="order-detail-heading">
                        <MapPin size={19} />
                        DELIVERY ADDRESS
                      </h3>

                      <div className="order-detail-content">
                        <p className="detail-name">
                          {customer.fullName || "Customer"}
                        </p>

                        <p>
                          {address.address || "Address unavailable"}
                        </p>

                        {(address.city || address.state) && (
                          <p>
                            {[address.city, address.state]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}

                        {address.pincode && (
                          <p>
                            <span className="detail-label">PIN Code</span>
                            <span className="detail-value">
                              {address.pincode}
                            </span>
                          </p>
                        )}

                        {customer.phone && (
                          <p>
                            <span className="detail-label">Phone</span>
                            <span className="detail-value">
                              {customer.phone}
                            </span>
                          </p>
                        )}

                        {customer.email && (
                          <p>
                            <span className="detail-label">Email</span>
                            <span className="detail-value">
                              {customer.email}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="order-detail-section">
                      <h3 className="order-detail-heading">
                        <CreditCard size={19} />
                        PRICE DETAILS
                      </h3>

                      <div className="price-detail-row">
                        <span>Subtotal</span>
                        <strong>{formatPrice(order.subtotal)}</strong>
                      </div>

                      <div className="price-detail-row">
                        <span>Delivery Charge</span>
                        <strong>
                          {Number(order.deliveryCharge || 0) === 0
                            ? "FREE"
                            : formatPrice(order.deliveryCharge)}
                        </strong>
                      </div>

                      <div className="price-detail-row price-total-row">
                        <span>Total Amount</span>
                        <strong>{formatPrice(order.totalAmount)}</strong>
                      </div>
                    </div>

                    <div className="order-detail-section order-tracking-section">
                      <h3 className="order-detail-heading">
                        <Truck size={19} />
                        ORDER TRACKING
                      </h3>

                      <div className={`tracking-status ${status}`}>
                        <div className="tracking-status-icon">
                          {status === "delivered" ? (
                            <CheckCircle2 size={23} />
                          ) : status === "cancelled" ? (
                            <Package size={23} />
                          ) : (
                            <Clock size={23} />
                          )}
                        </div>

                        <div className="tracking-status-text">
                          <strong>{formatStatus(status)}</strong>

                          <p>
                            {status === "delivered"
                              ? "Your order has been delivered."
                              : status === "cancelled"
                                ? "This order has been cancelled."
                                : status === "shipped"
                                  ? "Your order is on its way."
                                  : status === "confirmed"
                                    ? "Your order has been confirmed."
                                    : "Your order status will update as it progresses."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Orders;