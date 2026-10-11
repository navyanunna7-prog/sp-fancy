import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  RefreshCw,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
  ImageOff,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminProducts.css";

const API_URL = "http://localhost:5000/api/products";

const categories = [
  "All Categories",
  "Jewellery",
  "Slippers",
  "Handbags",
  "Accessories",
];

const getStockState = (stock) => {
  const quantity = Number(stock || 0);

  if (quantity <= 0) {
    return { label: "Out of Stock", className: "out-of-stock" };
  }

  if (quantity <= 5) {
    return { label: "Low Stock", className: "low-stock" };
  }

  return { label: "In Stock", className: "in-stock" };
};

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("all");
  const [deletingId, setDeletingId] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("spFancyAdminToken");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchProducts = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccess("");

      const response = await axios.get(API_URL);

      const data = response.data;
      const productList = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      setProducts(productList);
    } catch (err) {
      console.error("Fetch products error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        product.name?.toLowerCase().includes(searchText) ||
        product.category?.toLowerCase().includes(searchText) ||
        String(product._id).toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All Categories" ||
        product.category?.toLowerCase() === category.toLowerCase();

      const quantity = Number(product.stock || 0);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "available" && quantity > 5) ||
        (stockFilter === "low" && quantity > 0 && quantity <= 5) ||
        (stockFilter === "out" && quantity <= 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, category, stockFilter]);

  const totalStock = products.reduce(
    (sum, product) => sum + Math.max(0, Number(product.stock || 0)),
    0
  );

  const lowStockCount = products.filter((product) => {
    const stock = Number(product.stock || 0);
    return stock > 0 && stock <= 5;
  }).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.stock || 0) <= 0
  ).length;

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" permanently?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product._id);
      setError("");
      setSuccess("");

      await axios.delete(`${API_URL}/${product._id}`, {
        headers: getHeaders(),
      });

      setProducts((current) =>
        current.filter((item) => item._id !== product._id)
      );

      setSuccess(`${product.name} deleted successfully.`);
    } catch (err) {
      console.error("Delete product error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete this product."
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="admin-layout sp-products-page">
      <AdminSidebar />

      <main className="admin-main sp-products-main">
        <header className="sp-products-header">
          <div>
            <p className="sp-products-eyebrow">
              SP FANCY / STORE MANAGEMENT
            </p>

            <h1>Product Management</h1>

            <p className="sp-products-subtitle">
              Manage your collection, prices and inventory in one place.
            </p>
          </div>

          <div className="sp-products-header-actions">
            <button
              type="button"
              className="sp-products-refresh"
              onClick={() => fetchProducts(true)}
              disabled={refreshing || loading}
            >
              <RefreshCw
                size={16}
                className={refreshing ? "sp-spinning" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              className="sp-products-add"
              onClick={() => navigate("/admin/products/add")}
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </header>

        {error && (
          <div className="sp-products-alert sp-products-alert-error">
            <XCircle size={18} />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="sp-products-alert sp-products-alert-success">
            <CheckCircle2 size={18} />
            <span>{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        <section className="sp-products-stats">
          <article className="sp-products-stat-card">
            <div className="sp-products-stat-icon stat-icon-dark">
              <Package size={22} />
            </div>
            <div>
              <span>Total Products</span>
              <strong>{products.length}</strong>
              <small>Products in your store</small>
            </div>
          </article>

          <article className="sp-products-stat-card">
            <div className="sp-products-stat-icon stat-icon-gold">
              <Boxes size={22} />
            </div>
            <div>
              <span>Total Stock Units</span>
              <strong>{totalStock.toLocaleString("en-IN")}</strong>
              <small>Units currently recorded</small>
            </div>
          </article>

          <article className="sp-products-stat-card">
            <div className="sp-products-stat-icon stat-icon-orange">
              <AlertTriangle size={22} />
            </div>
            <div>
              <span>Low Stock</span>
              <strong>{lowStockCount}</strong>
              <small>1–5 units remaining</small>
            </div>
          </article>

          <article className="sp-products-stat-card">
            <div className="sp-products-stat-icon stat-icon-red">
              <XCircle size={22} />
            </div>
            <div>
              <span>Out of Stock</span>
              <strong>{outOfStockCount}</strong>
              <small>Products needing restock</small>
            </div>
          </article>
        </section>

        <section className="sp-products-inventory">
          <div className="sp-products-section-heading">
            <div>
              <h2>Store Inventory</h2>
              <p>
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <span className="sp-products-live-label">
              <span />
              INVENTORY
            </span>
          </div>

          <div className="sp-products-toolbar">
            <label className="sp-products-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search name, category or product ID..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label className="sp-products-filter">
              <Filter size={16} />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="sp-products-filter">
              <select
                aria-label="Filter by stock"
                value={stockFilter}
                onChange={(event) => setStockFilter(event.target.value)}
              >
                <option value="all">All Stock</option>
                <option value="available">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </label>
          </div>

          {loading ? (
            <div className="sp-products-state">
              <RefreshCw size={28} className="sp-spinning" />
              <p>Loading your products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="sp-products-state">
              <Package size={36} />
              <h3>No products found</h3>
              <p>Try another search or change your filters.</p>

              <button
                type="button"
                className="sp-products-reset"
                onClick={() => {
                  setSearch("");
                  setCategory("All Categories");
                  setStockFilter("all");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="sp-products-table-wrap">
              <table className="sp-products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Inventory Status</th>
                    <th className="sp-products-action-heading">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const stock = Number(product.stock || 0);
                    const stockState = getStockState(stock);

                    return (
                      <tr key={product._id}>
                        <td>
                          <div className="sp-products-product-cell">
                            <div className="sp-products-product-image">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name || "Product"}
                                  loading="lazy"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <ImageOff size={22} />
                              )}
                            </div>

                            <div className="sp-products-product-info">
                              <strong>{product.name || "Unnamed product"}</strong>
                              <span>
                                ID: {String(product._id || "").slice(-8).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="sp-products-category">
                            {product.category || "Uncategorized"}
                          </span>
                        </td>

                        <td>
                          <div className="sp-products-price">
                            ₹{Number(product.price || 0).toLocaleString("en-IN")}
                            {Number(product.oldPrice || 0) > Number(product.price || 0) && (
                              <del>
                                ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                              </del>
                            )}
                          </div>
                        </td>

                        <td>
                          <strong className="sp-products-stock-number">
                            {stock}
                          </strong>
                          <span className="sp-products-stock-unit"> units</span>
                        </td>

                        <td>
                          <span
                            className={`sp-products-stock-badge ${stockState.className}`}
                          >
                            <span />
                            {stockState.label}
                          </span>
                        </td>

                        <td>
                          <div className="sp-products-row-actions">
                            <button
                              type="button"
                              className="sp-products-edit"
                              title="Edit product and stock"
                              aria-label={`Edit ${product.name}`}
                              onClick={() =>
                                navigate(`/admin/products/edit/${product._id}`)
                              }
                            >
                              <Pencil size={16} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              className="sp-products-delete"
                              title="Delete product"
                              aria-label={`Delete ${product.name}`}
                              disabled={deletingId === product._id}
                              onClick={() => handleDelete(product)}
                            >
                              {deletingId === product._id ? (
                                <RefreshCw size={16} className="sp-spinning" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <footer className="sp-products-table-footer">
              <span>
                {filteredProducts.length} product(s) displayed
              </span>
              <span>
                Low stock threshold: <strong>5 units</strong>
              </span>
            </footer>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminProducts;