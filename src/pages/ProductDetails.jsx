import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

       const response = await api.get(`/products/${id}`);

        const data = response.data;

        setProduct({
          ...data,
          id: data._id,
          category:
            data.category.charAt(0).toUpperCase() +
            data.category.slice(1),
        });
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error
        );

        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <ShoppingBag
            size={52}
            strokeWidth={1.2}
          />

          <p className="section-label">
            LOADING PRODUCT
          </p>

          <h1>
            Please wait...
          </h1>
        </div>
      </main>
    );
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================

  if (!product || error) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">

          <ShoppingBag
            size={52}
            strokeWidth={1.2}
          />

          <p className="section-label">
            PRODUCT NOT FOUND
          </p>

          <h1>
            This product doesn't exist.
          </h1>

          <Link
            to="/shop"
            className="primary-btn"
          >
            BACK TO SHOP
          </Link>

        </div>
      </main>
    );
  }

  const liked = isWishlisted(product.id);

  const discount =
    product.oldPrice &&
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice -
            product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  // =========================
  // ADD TO CART
  // =========================

  const addProductToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  // =========================
  // BUY NOW
  // =========================

  const handleBuyNow = () => {
    addProductToCart();
    navigate("/cart");
  };

  return (
    <main className="product-details-page">

      {/* BACK */}

      <Link
        to="/shop"
        className="back-to-shop"
      >
        <ArrowLeft size={16} />
        BACK TO SHOP
      </Link>

      {/* PRODUCT */}

      <div className="product-details-layout">

        {/* IMAGE */}

        <div className="product-details-image">

          <img
            src={product.image}
            alt={product.name}
          />

          {discount > 0 && (
            <span className="product-details-sale">
              {discount}% OFF
            </span>
          )}

          <button
            className={
              liked
                ? "product-wishlist-btn liked"
                : "product-wishlist-btn"
            }
            onClick={() =>
              toggleWishlist(product)
            }
            aria-label="Add to wishlist"
          >
            <Heart
              size={21}
              fill={
                liked
                  ? "currentColor"
                  : "none"
              }
            />
          </button>

        </div>

        {/* INFORMATION */}

        <div className="product-details-info">

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>
            {product.name}
          </h1>

          <div className="product-details-price">

            <span>
              ₹{product.price}
            </span>

            {product.oldPrice && (
              <del>
                ₹{product.oldPrice}
              </del>
            )}

            {discount > 0 && (
              <strong>
                {discount}% OFF
              </strong>
            )}

          </div>

          <p className="product-details-tax">
            Inclusive of all taxes
          </p>

          <div className="product-divider"></div>

          <p className="product-description">
            {product.description}
          </p>

          {/* BENEFITS */}

          <div className="product-benefits">

            <div className="product-benefit">

              <div className="product-benefit-icon">
                <Truck size={18} />
              </div>

              <div>
                <strong>
                  Fast Delivery
                </strong>

                <span>
                  Delivered to your doorstep
                </span>
              </div>

            </div>

            <div className="product-benefit">

              <div className="product-benefit-icon">
                <RotateCcw size={18} />
              </div>

              <div>
                <strong>
                  Easy Returns
                </strong>

                <span>
                  Simple return process
                </span>
              </div>

            </div>

            <div className="product-benefit">

              <div className="product-benefit-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>
                  Secure Shopping
                </strong>

                <span>
                  Safe shopping experience
                </span>
              </div>

            </div>

          </div>

          <div className="product-divider"></div>

          {/* QUANTITY */}

          <div className="quantity-section">

            <p>
              QUANTITY
            </p>

            <div className="product-quantity">

              <button
                onClick={() =>
                  setQuantity(
                    (current) =>
                      Math.max(
                        1,
                        current - 1
                      )
                  )
                }
                disabled={quantity === 1}
              >
                <Minus size={15} />
              </button>

              <span>
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(
                    (current) =>
                      current + 1
                  )
                }
              >
                <Plus size={15} />
              </button>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="product-action-buttons">

            <button
              className="add-cart-detail"
              onClick={addProductToCart}
            >
              <ShoppingBag size={18} />
              ADD TO CART
            </button>

            <button
              className="buy-now-detail"
              onClick={handleBuyNow}
            >
              BUY NOW
            </button>

          </div>

          {/* DELIVERY NOTE */}

          <div className="product-note">

            <span>🚚</span>

            <div>
              <strong>
                Free delivery on orders above ₹999
              </strong>

              <p>
                Cash on Delivery available
              </p>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;
