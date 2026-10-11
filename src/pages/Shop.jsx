import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  ShoppingBag,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Shop() {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchText, setSearchText] = useState(urlSearch);

  const [selectedCategory, setSelectedCategory] = useState(
    urlCategory === "All"
      ? "All"
      : urlCategory.charAt(0).toUpperCase() +
          urlCategory.slice(1)
  );

  const [sortBy, setSortBy] = useState("default");

  const categories = [
    "All",
    "Jewellery",
    "Slippers",
    "Handbags",
    "Accessories",
  ];

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        const formattedProducts = response.data.map(
          (product) => ({
            ...product,
            id: product._id,
            category:
              product.category.charAt(0).toUpperCase() +
              product.category.slice(1),
          })
        );

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);

        setError(
          "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchText.trim();

    const params = {};

    if (value !== "") {
      params.search = value;
    }

    if (selectedCategory !== "All") {
      params.category =
        selectedCategory.toLowerCase();
    }

    setSearchParams(params);
  };

  // =========================
  // CATEGORY
  // =========================

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    const params = {};

    if (searchText.trim() !== "") {
      params.search = searchText.trim();
    }

    if (category !== "All") {
      params.category = category.toLowerCase();
    }

    setSearchParams(params);
  };

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategory("All");
    setSearchParams({});
  };

  // =========================
  // FILTER + SORT
  // =========================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category === selectedCategory
      );
    }

    // Search
    if (urlSearch.trim() !== "") {
      const search = urlSearch
        .trim()
        .toLowerCase();

      result = result.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(search) ||
          product.category
            .toLowerCase()
            .includes(search) ||
          product.description
            .toLowerCase()
            .includes(search)
      );
    }

    // Sort
    if (sortBy === "low-high") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortBy === "high-low") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [
    products,
    selectedCategory,
    urlSearch,
    sortBy,
  ]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="shop-page">
        <div className="no-products">
          <h2>Loading Products...</h2>
          <p>
            Please wait while we load our
            collection.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="shop-page">
        <div className="no-products">
          <Search
            size={40}
            strokeWidth={1.2}
          />

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            TRY AGAIN
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="shop-page">

      {/* =========================
          HEADING
      ========================= */}

      <div className="shop-heading">

        <div>
          <p className="section-label">
            OUR COLLECTION
          </p>

          <h1>
            {urlSearch
              ? `Search results for "${urlSearch}"`
              : selectedCategory === "All"
              ? "Shop All"
              : selectedCategory}
          </h1>

          <p>
            Discover jewellery, slippers,
            handbags and accessories made
            to complete your style.
          </p>
        </div>

        <div className="shop-count">
          {filteredProducts.length} Products
        </div>

      </div>

      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="shop-toolbar">

        <div className="category-filters">

          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-filter active"
                  : "category-filter"
              }
              onClick={() =>
                handleCategoryChange(category)
              }
            >
              {category}
            </button>
          ))}

        </div>

        <div className="shop-tools">

          {/* SEARCH */}

          <form
            className="shop-search"
            onSubmit={handleSearch}
          >
            <Search size={17} />

            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            {searchText && (
              <button
                type="button"
                className="shop-search-clear"
                onClick={clearFilters}
              >
                ×
              </button>
            )}
          </form>

          {/* SORT */}

          <div className="sort-box">

            <SlidersHorizontal size={16} />

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="default">
                Sort By
              </option>

              <option value="low-high">
                Price: Low to High
              </option>

              <option value="high-low">
                Price: High to Low
              </option>

              <option value="name">
                Name
              </option>
            </select>

          </div>

        </div>

      </div>

      {/* =========================
          SEARCH STATUS
      ========================= */}

      {urlSearch && (
        <div className="search-result-info">

          <span>
            Showing results for{" "}
            <strong>"{urlSearch}"</strong>
          </span>

          <button onClick={clearFilters}>
            CLEAR SEARCH
          </button>

        </div>
      )}

      {/* =========================
          PRODUCTS
      ========================= */}

      {filteredProducts.length === 0 ? (

        <div className="no-products">

          <Search
            size={40}
            strokeWidth={1.2}
          />

          <h2>
            No Products Found
          </h2>

          <p>
            We couldn't find any products
            matching your search.
          </p>

          <button onClick={clearFilters}>
            VIEW ALL PRODUCTS
          </button>

        </div>

      ) : (

        <section className="product-grid">

          {filteredProducts.map((product) => {

            const liked =
              isWishlisted(product.id);

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

            return (
              <article
                className="product-card"
                key={product.id}
              >

                <Link
                  to={`/product/${product.id}`}
                  className="product-card-link"
                >

                  <div className="product-image">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    {discount > 0 && (
                      <span className="product-sale">
                        {discount}% OFF
                      </span>
                    )}

                  </div>

                  <div className="product-info">

                    <p className="product-category">
                      {product.category}
                    </p>

                    <h3>
                      {product.name}
                    </h3>

                    <div className="product-price">

                      <span>
                        ₹{product.price}
                      </span>

                      {product.oldPrice && (
                        <del>
                          ₹{product.oldPrice}
                        </del>
                      )}

                    </div>

                  </div>

                </Link>

                {/* WISHLIST */}

                <button
                  className={
                    liked
                      ? "wishlist-btn liked"
                      : "wishlist-btn"
                  }
                  onClick={() =>
                    toggleWishlist(product)
                  }
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={19}
                    fill={
                      liked
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>

                {/* CART */}

                <button
                  className="add-cart-btn"
                  onClick={() =>
                    addToCart(product)
                  }
                >
                  <ShoppingBag size={17} />
                  ADD TO CART
                </button>

              </article>
            );
          })}

        </section>

      )}

    </main>
  );
}

export default Shop;