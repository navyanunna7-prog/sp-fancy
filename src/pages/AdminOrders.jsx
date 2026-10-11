import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingBag,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "spFancyAdminToken"
      );

      console.log(
        "ADMIN TOKEN:",
        token
      );

      if (!token) {
        setError(
          "Admin session expired. Please login again."
        );

        navigate("/admin/login");

        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ADMIN ORDERS RESPONSE:",
        response.data
      );

      setOrders(response.data);
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem(
          "spFancyAdminToken"
        );

        localStorage.removeItem(
          "spFancyAdmin"
        );

        setError(
          "Admin session expired. Please login again."
        );

        navigate("/admin/login");

        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "placed":
        return <Package size={15} />;

      case "confirmed":
        return <CheckCircle size={15} />;

      case "shipped":
        return <Truck size={15} />;

      case "delivered":
        return <CheckCircle size={15} />;

      case "cancelled":
        return <XCircle size={15} />;

      default:
        return <Package size={15} />;
    }
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-brand">
          <ShoppingBag size={24} />

          <div>
            <h2>SP FANCY</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">

          <button
            className="admin-nav-link"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className="admin-nav-link"
            onClick={() =>
              navigate("/admin/products")
            }
          >
            Products
          </button>

          <button
            className="admin-nav-link active"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            Orders
          </button>

          <button
            className="admin-nav-link"
            onClick={() =>
              navigate("/admin/customers")
            }
          >
            Customers
          </button>

        </nav>

        <button
          className="admin-sidebar-logout"
          onClick={() => {
            localStorage.removeItem(
              "spFancyAdminToken"
            );

            localStorage.removeItem(
              "spFancyAdmin"
            );

            navigate("/admin/login");
          }}
        >
          <span>Logout</span>
        </button>

      </aside>


      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-main-header">

          <div>
            <p className="section-label">
              SP FANCY
            </p>

            <h1>Orders</h1>

            <p>
              Manage customer orders and deliveries.
            </p>
          </div>

        </header>


        {error && (
          <div className="admin-page-error">
            {error}
          </div>
        )}


        {loading ? (

          <div className="admin-loading">
            Loading orders...
          </div>

        ) : orders.length === 0 ? (

          <div className="admin-empty-products">

            <ShoppingBag size={45} />

            <h2>No Orders Found</h2>

            <p>
              Customer orders will appear here.
            </p>

          </div>

        ) : (

          <section className="admin-orders-list">

            {orders.map((order) => (

              <article
                className="admin-order-card"
                key={order._id}
              >

                <div className="admin-order-top">

                  <div>

                    <span className="admin-order-label">
                      ORDER ID
                    </span>

                    <h2>
                      #
                      {order._id
                        .slice(-8)
                        .toUpperCase()}
                    </h2>

                  </div>

                  <div className="admin-order-date">
                    {formatDate(
                      order.createdAt
                    )}
                  </div>

                </div>


                <div className="admin-order-details">

                  <div>
                    <span>Customer</span>

                    <strong>
                      {order.customer?.fullName ||
                        "Customer"}
                    </strong>
                  </div>


                  <div>
                    <span>Phone</span>

                    <strong>
                      {order.customer?.phone ||
                        "Not available"}
                    </strong>
                  </div>


                  <div>
                    <span>Items</span>

                    <strong>
                      {order.items?.length || 0}
                    </strong>
                  </div>


                  <div>
                    <span>Total</span>

                    <strong className="admin-order-total">
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                </div>


                <div className="admin-order-bottom">

                  <div
                    className={`admin-order-status status-${order.orderStatus}`}
                  >
                    {getStatusIcon(
                      order.orderStatus
                    )}

                    {formatStatus(
                      order.orderStatus
                    )}
                  </div>


                  <div className="admin-order-payment">
                    Payment:{" "}

                    <strong>
                      {order.paymentMethod?.toUpperCase() ||
                        "COD"}
                    </strong>
                  </div>


                  <button
                    className="admin-view-order-btn"
                    onClick={() =>
                      navigate(
                        `/admin/orders/${order._id}`
                      )
                    }
                  >
                    <Eye size={16} />
                    VIEW ORDER
                  </button>

                </div>

              </article>

            ))}

          </section>

        )}

      </main>

    </div>
  );
}

export default AdminOrders;