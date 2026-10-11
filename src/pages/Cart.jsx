import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const deliveryCharge =
    cartTotal >= 999 || cartTotal === 0 ? 0 : 50;

  const finalTotal = cartTotal + deliveryCharge;

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // EMPTY CART
  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <ShoppingBag
            size={55}
            strokeWidth={1.2}
          />

          <p className="section-label">
            YOUR SHOPPING BAG
          </p>

          <h1>Your Cart is Empty</h1>

          <p>
            Looks like you haven't added anything
            to your cart yet.
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

  return (
    <main className="cart-page">

      {/* CART HEADING */}

      <div className="cart-heading">

        <p className="section-label">
          YOUR SHOPPING BAG
        </p>

        <h1>
          Shopping Cart
        </h1>

        <p>
          {totalItems}{" "}
          {totalItems === 1 ? "item" : "items"}{" "}
          in your cart
        </p>

      </div>

      {/* CART CONTENT */}

      <div className="cart-layout">

        {/* LEFT SIDE */}

        <section className="cart-items">

          {cartItems.map((item) => {

            const stock = item.stock ?? Infinity;

            return (
              <div
                className="cart-item"
                key={item.id}
              >

                {/* PRODUCT IMAGE */}

                <img
                  src={item.image}
                  alt={item.name}
                />

                {/* PRODUCT DETAILS */}

                <div className="cart-item-details">

                  <p className="product-category">
                    {item.category}
                  </p>

                  <h3>
                    {item.name}
                  </h3>

                  <p className="cart-item-price">
                    ₹{item.price}
                  </p>

                  {/* QUANTITY */}

                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      disabled={
                        item.quantity === 1
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} />
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      disabled={
                        item.quantity >= stock
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </button>

                  </div>

                  {/* STOCK MESSAGE */}

                  {stock !== Infinity && (
                    <small className="cart-stock-info">
                      {item.quantity >= stock
                        ? "Maximum available quantity reached"
                        : `${stock - item.quantity} left in stock`}
                    </small>
                  )}

                </div>

                {/* PRICE + REMOVE */}

                <div className="cart-item-right">

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>

                  <button
                    className="remove-item"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            );
          })}

          {/* CONTINUE SHOPPING */}

          <Link
            to="/shop"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>

        </section>

        {/* RIGHT SIDE - ORDER SUMMARY */}

        <aside className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹{cartTotal}
            </span>

          </div>

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <span>
              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge}`}
            </span>

          </div>

          <p className="delivery-note">

            {cartTotal >= 999
              ? "You have unlocked free delivery!"
              : `Add ₹${
                  999 - cartTotal
                } more for free delivery.`}

          </p>

          <div className="summary-total">

            <strong>
              Total
            </strong>

            <strong>
              ₹{finalTotal}
            </strong>

          </div>

          <Link
            to="/checkout"
            className="checkout-btn"
          >
            PROCEED TO CHECKOUT
          </Link>

          <p className="secure-note">
            Secure shopping experience
          </p>

        </aside>

      </div>

    </main>
  );
}

export default Cart;