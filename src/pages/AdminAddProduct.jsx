import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";

function AdminAddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "jewellery",
    price: "",
    oldPrice: "",
    image: "",
    description: "",
    stock: "",
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("spFancyAdminToken");

      if (!token) {
        setError("Admin session missing. Please log in again.");
        return;
      }

      await axios.post(
        "https://sp-fancy-backend-1.onrender.com/api/products",
        {
          name: formData.name.trim(),
          category: formData.category,
          price: Number(formData.price),
          oldPrice: formData.oldPrice
            ? Number(formData.oldPrice)
            : null,
          image: formData.image.trim(),
          description: formData.description.trim(),
          stock: Number(formData.stock),
          featured: formData.featured,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/admin/products");
    } catch (error) {
      console.error("Add product error:", error);

      if (error.response?.status === 401) {
        setError("Admin authentication failed. Please log in again.");
      } else if (error.response?.status === 403) {
        setError("Access denied. Admin permission is required.");
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to add product. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-main-header">
          <div>
            <p className="section-label">SP FANCY • PRODUCTS</p>
            <h1>Add Product</h1>
            <p>Add a new product to your store catalogue.</p>
          </div>

          <button
            type="button"
            className="admin-back-btn"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft size={16} />
            BACK TO PRODUCTS
          </button>
        </header>

        {error && (
          <div className="admin-page-error">{error}</div>
        )}

        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="admin-form-title">
            <div className="admin-form-title-icon">
              <ImagePlus size={21} />
            </div>
            <div>
              <h2>Product Information</h2>
              <p>Enter the details of your new product.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group full-width">
              <label>PRODUCT NAME</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label>CATEGORY</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="jewellery">Jewellery</option>
                <option value="slippers">Slippers</option>
                <option value="handbags">Handbags</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>PRICE</label>
              <div className="admin-input-prefix">
                <span>₹</span>
                <input
                  type="number"
                  name="price"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>OLD PRICE</label>
              <div className="admin-input-prefix">
                <span>₹</span>
                <input
                  type="number"
                  name="oldPrice"
                  placeholder="0"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>STOCK QUANTITY</label>
              <input
                type="number"
                name="stock"
                placeholder="Enter quantity"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="admin-form-group full-width">
              <label>PRODUCT IMAGE URL</label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/product-image.jpg"
                value={formData.image}
                onChange={handleChange}
                required
              />
              <small className="admin-input-help">
                Use a direct image URL for the product photo.
              </small>
            </div>

            <div className="admin-form-group full-width">
              <label>DESCRIPTION</label>
              <textarea
                name="description"
                placeholder="Write a short description about this product..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <label className="admin-featured-checkbox">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <div>
                <strong>Featured Product</strong>
                <span>Show this product in featured sections.</span>
              </div>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-cancel-btn"
              onClick={() => navigate("/admin/products")}
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="admin-save-btn"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? "ADDING PRODUCT..." : "ADD PRODUCT"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AdminAddProduct;
