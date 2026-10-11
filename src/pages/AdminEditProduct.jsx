import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import {
  ArrowLeft,
  ImagePlus,
  Save,
} from "lucide-react";

function AdminEditProduct() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        const product = response.data;

        setFormData({
          name: product.name || "",
          category:
            product.category || "jewellery",
          price: product.price ?? "",
          oldPrice: product.oldPrice ?? "",
          image: product.image || "",
          description:
            product.description || "",
          stock: product.stock ?? "",
          featured:
            product.featured || false,
        });
      } catch (error) {
        console.error(
          "Fetch product error:",
          error
        );

        setError(
          "Unable to load product details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          name: formData.name.trim(),
          category: formData.category,
          price: Number(formData.price),
          oldPrice: formData.oldPrice
            ? Number(formData.oldPrice)
            : null,
          image: formData.image.trim(),
          description:
            formData.description.trim(),
          stock: Number(formData.stock),
          featured: formData.featured,
        }
      );

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">

        <AdminSidebar />

        <main className="admin-main">

          <div className="admin-loading">
            Loading product details...
          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main">

        <header className="admin-main-header">

          <div>

            <p className="section-label">
              SP FANCY • PRODUCTS
            </p>

            <h1>Edit Product</h1>

            <p>
              Update your product information.
            </p>

          </div>

          <button
            type="button"
            className="admin-back-btn"
            onClick={() =>
              navigate("/admin/products")
            }
          >
            <ArrowLeft size={16} />
            BACK TO PRODUCTS
          </button>

        </header>


        {error && (
          <div className="admin-page-error">
            {error}
          </div>
        )}


        <form
          className="admin-product-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-form-title">

            <div className="admin-form-title-icon">
              <ImagePlus size={21} />
            </div>

            <div>
              <h2>Product Information</h2>

              <p>
                Update the details of this
                product.
              </p>
            </div>

          </div>


          <div className="admin-form-grid">


            {/* PRODUCT NAME */}

            <div className="admin-form-group full-width">

              <label>
                PRODUCT NAME
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* CATEGORY */}

            <div className="admin-form-group">

              <label>
                CATEGORY
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >

                <option value="jewellery">
                  Jewellery
                </option>

                <option value="slippers">
                  Slippers
                </option>

                <option value="handbags">
                  Handbags
                </option>

                <option value="accessories">
                  Accessories
                </option>

              </select>

            </div>


            {/* PRICE */}

            <div className="admin-form-group">

              <label>
                PRICE
              </label>

              <div className="admin-input-prefix">

                <span>₹</span>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>

            </div>


            {/* OLD PRICE */}

            <div className="admin-form-group">

              <label>
                OLD PRICE
              </label>

              <div className="admin-input-prefix">

                <span>₹</span>

                <input
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  min="0"
                />

              </div>

            </div>


            {/* STOCK */}

            <div className="admin-form-group">

              <label>
                STOCK QUANTITY
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />

            </div>


            {/* IMAGE URL */}

            <div className="admin-form-group full-width">

              <label>
                PRODUCT IMAGE URL
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />

              <small className="admin-input-help">
                Use a direct image URL for the
                product photo.
              </small>

            </div>


            {/* DESCRIPTION */}

            <div className="admin-form-group full-width">

              <label>
                DESCRIPTION
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />

            </div>


            {/* FEATURED */}

            <label className="admin-featured-checkbox">

              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />

              <div>

                <strong>
                  Featured Product
                </strong>

                <span>
                  Show this product in featured
                  sections.
                </span>

              </div>

            </label>

          </div>


          {/* ACTIONS */}

          <div className="admin-form-actions">

            <button
              type="button"
              className="admin-cancel-btn"
              onClick={() =>
                navigate("/admin/products")
              }
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="admin-save-btn"
              disabled={saving}
            >

              <Save size={16} />

              {saving
                ? "SAVING..."
                : "SAVE CHANGES"}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default AdminEditProduct;