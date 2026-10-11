import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const { addToCart } = useCart();

  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <main className="wishlist-page">

        <div className="empty-wishlist">

          <Heart
            size={60}
            strokeWidth={1.2}
          />

          <p className="section-label">
            YOUR WISHLIST
          </p>

          <h1>Your Wishlist is Empty</h1>

          <p>
            Save your favourite products here
            and shop them whenever you want.
          </p>

          <Link
            to="/shop"
            className="primary-btn"
          >
            EXPLORE PRODUCTS
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="wishlist-page">

      {/* HEADER */}
      <div className="wishlist-heading">

        <p className="section-label">
          YOUR COLLECTION
        </p>

        <h1>My Wishlist</h1>

        <p>
          {wishlistItems.length}{" "}
          {wishlistItems.length === 1
            ? "product"
            : "products"}{" "}
          saved for later
        </p>

      </div>


      {/* PRODUCTS */}
      <section className="wishlist-grid">

        {wishlistItems.map((product) => (

          <div
            className="wishlist-card"
            key={product.id}
          >

            {/* IMAGE */}
            <div className="wishlist-image">

              <img
                src={product.image}
                alt={product.name}
              />

              <button
                className="wishlist-remove"
                onClick={() =>
                  removeFromWishlist(product.id)
                }
                aria-label="Remove from wishlist"
              >
                <Trash2 size={18} />
              </button>

            </div>


            {/* DETAILS */}
            <div className="wishlist-info">

              <p className="product-category">
                {product.category}
              </p>

              <h3>{product.name}</h3>

              <div className="wishlist-price">

                <span>
                  ₹{product.price}
                </span>

                <del>
                  ₹{product.oldPrice}
                </del>

              </div>


              {/* ADD TO CART */}
              <button
                className="wishlist-cart-btn"
                onClick={() =>
                  addToCart(product)
                }
              >
                <ShoppingBag size={17} />

                ADD TO CART
              </button>

            </div>

          </div>

        ))}

      </section>

    </main>
  );
}

export default Wishlist;