import { Link, useParams } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";

function OrderSuccess() {
  const { id } = useParams();

  return (
    <main className="order-success-page">
      <div className="order-success-card">

        <div className="order-success-icon">
          <CheckCircle size={60} strokeWidth={1.4} />
        </div>

        <p className="section-label">
          ORDER CONFIRMED
        </p>

        <h1>
          Thank You for Your Order! 🎉
        </h1>

        <p className="order-success-message">
          Your order has been successfully placed.
          We will prepare your order and deliver it
          to your doorstep.
        </p>

        <div className="order-id-box">
          <span>ORDER ID</span>
          <strong>{id}</strong>
        </div>

        <div className="order-success-payment">
          <ShoppingBag size={18} />

          <div>
            <strong>
              Cash on Delivery
            </strong>

            <span>
              Pay when your order arrives.
            </span>
          </div>
        </div>

        <div className="order-success-actions">

          <Link
            to="/shop"
            className="primary-btn"
          >
            CONTINUE SHOPPING
          </Link>

          <Link
            to="/home"
            className="secondary-btn"
          >
            BACK TO HOME
          </Link>

        </div>

      </div>
    </main>
  );
}

export default OrderSuccess;