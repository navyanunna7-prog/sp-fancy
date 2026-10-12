import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import {
  Lock,
  MapPin,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const deliveryCharge =
    cartTotal >= 999 || cartTotal === 0
      ? 0
      : 50;

  const finalTotal =
    cartTotal + deliveryCharge;

  const savedUser = JSON.parse(
    localStorage.getItem("spFancyUser") || "null"
  );

  const [formData, setFormData] = useState({
    fullName: savedUser?.fullName || "",
    phone: savedUser?.phone || "",
    email: savedUser?.email || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get login token
      const token = localStorage.getItem(
        "spFancyToken"
      );

      // Check token
      if (!token) {
        setError(
          "Your session has expired. Please login again."
        );

        navigate("/login");
        return;
      }

      const orderData = {
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },

        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },

        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),

        subtotal: cartTotal,
        deliveryCharge: deliveryCharge,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod,
      };

      // Send order with JWT token
     const response = await api.post(
  "/orders",
  orderData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      const createdOrder =
        response.data.order;

      // Clear cart
      clearCart();

      // Save latest order
      localStorage.setItem(
        "spFancyLatestOrder",
        JSON.stringify(createdOrder)
      );

      // Go to success page
      navigate(
        `/order-success/${createdOrder._id}`,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* EMPTY CART */

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="empty-checkout">
          <ShoppingBag
            size={55}
            strokeWidth={1.2}
          />

          <h1>Your Cart is Empty</h1>

          <p>
            Add some products before
            proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="primary-btn"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </main>
    );
  }

  /* CHECKOUT PAGE */

  return (
    <main className="checkout-page">

      <div className="checkout-heading">
        <p className="section-label">
          SECURE CHECKOUT
        </p>

        <h1>Complete Your Order</h1>

        <p>
          Enter your details and choose
          your payment method.
        </p>
      </div>

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      <div className="checkout-layout">

        {/* LEFT SIDE */}

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          {/* DELIVERY DETAILS */}

          <div className="checkout-section">

            <div className="checkout-section-title">
              <MapPin size={19} />

              <h2>Delivery Details</h2>
            </div>

            <div className="form-grid">

              <div className="form-group full-width">
                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>

                <textarea
                  name="address"
                  placeholder="House no, street, area..."
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  placeholder="Your city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>State</label>

                <input
                  type="text"
                  name="state"
                  placeholder="Your state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>PIN Code</label>

                <input
                  type="text"
                  name="pincode"
                  placeholder="6-digit PIN"
                  value={formData.pincode}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  maxLength="6"
                  required
                />
              </div>

            </div>
          </div>

          {/* PAYMENT */}

          <div className="checkout-section">

            <div className="checkout-section-title">
              <Lock size={19} />

              <h2>Payment Method</h2>
            </div>

            <label className="payment-option">

              <input
                type="radio"
                name="payment"
                value="cod"
                checked={
                  paymentMethod === "cod"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              <div>
                <strong>
                  Cash on Delivery
                </strong>

                <p>
                  Pay when your order arrives.
                </p>
              </div>

            </label>

            <label className="payment-option disabled">

              <input
                type="radio"
                name="payment"
                value="online"
                disabled
              />

              <div>
                <strong>
                  Online Payment
                </strong>

                <p>
                  Online payment will be
                  available soon.
                </p>
              </div>

            </label>

          </div>

          {/* PLACE ORDER */}

          <button
            type="submit"
            className="place-order-btn"
            disabled={loading}
          >
            {loading
              ? "PLACING ORDER..."
              : "PLACE ORDER"}
          </button>

        </form>

        {/* RIGHT SIDE */}

        <aside className="checkout-summary">

          <h2>Order Summary</h2>

          <div className="checkout-products">

            {cartItems.map((item) => (

              <div
                className="checkout-product"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <h3>{item.name}</h3>

                  <p>
                    Qty: {item.quantity}
                  </p>
                </div>

                <strong>
                  ₹
                  {item.price *
                    item.quantity}
                </strong>

              </div>

            ))}

          </div>

          <div className="checkout-total-area">

            <div className="checkout-row">
              <span>Subtotal</span>

              <span>
                ₹{cartTotal}
              </span>
            </div>

            <div className="checkout-row">
              <span>Delivery</span>

              <span>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge}`}
              </span>
            </div>

            <div className="checkout-final-total">

              <strong>Total</strong>

              <strong>
                ₹{finalTotal}
              </strong>

            </div>

          </div>

          <p className="checkout-secure">
            <Lock size={14} />
            Your order information is secure.
          </p>

        </aside>

      </div>
    </main>
  );
}

export default Checkout;
