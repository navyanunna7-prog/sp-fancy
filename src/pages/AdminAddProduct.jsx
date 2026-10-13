import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://sp-fancy-backend-1.onrender.com/api/products";

function AdminAddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "Jewellery",
    price: "",
    oldPrice: "",
    image: "",
    description: "",
    stock: "",
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("spFancyToken");

      if (!token) {
        setError("Admin session missing. Please log in again.");
        return;
      }

      const productData = {
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
      };

      await axios.post(API_URL, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Product added successfully!");

      setFormData({
        name: "",
        category: "Jewellery",
        price: "",
        oldPrice: "",
        image: "",
        description: "",
        stock: "",
        featured: false,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        setError(
          "Unauthorized: admin token invalid or expired. Please check admin login."
        );
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin permission is required.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to add product. Please try again."
        );
      }

      console.error("Add product error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-form-container">
        <h1>Add Product</h1>
        <p>Enter the product details below.</p>

        {error && (
          <div className="auth-error">{error}</div>
        )}

        {success && (
          <div className="success-message">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Jewellery">Jewellery</option>
              <option value="Slippers">Slippers</option>
              <option value="Handbags">Handbags</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="auth-input-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Old Price (Optional)</label>
            <input
              type="number"
              name="oldPrice"
              min="0"
              step="0.01"
              value={formData.oldPrice}
              onChange={handleChange}
            />
          </div>

          <div className="auth-input-group">
            <label>Product Image URL</label>
            <input
              type="url"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <label>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            Featured Product
          </label>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? "ADDING PRODUCT..." : "ADD PRODUCT"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminAddProduct;
