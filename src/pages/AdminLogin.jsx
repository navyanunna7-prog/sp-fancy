import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Lock, Mail, ShieldCheck } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

  
const response = await api.post("/admin/login", {
  email,
  password,
});


      localStorage.setItem(
        "spFancyAdminToken",
        response.data.token
      );

      localStorage.setItem(
        "spFancyAdmin",
        JSON.stringify(response.data.admin)
      );

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to login as admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-icon">
          <ShieldCheck
            size={42}
            strokeWidth={1.5}
          />
        </div>

        <p className="section-label">
          SP FANCY
        </p>

        <h1>Admin Login</h1>

        <p className="admin-login-subtitle">
          Sign in to manage your store.
        </p>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="admin-input-group">
            <label>Email Address</label>

            <div className="admin-input-wrapper">
              <Mail size={18} />

              <input
                type="email"
                placeholder="admin@spfancy.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label>Password</label>

            <div className="admin-input-wrapper">
              <Lock size={18} />

              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading
              ? "SIGNING IN..."
              : "ADMIN LOGIN"}
          </button>

        </form>

        <button
          className="back-to-store-btn"
          onClick={() => navigate("/login")}
        >
          ← Back to Customer Login
        </button>

      </div>
    </main>
  );
}

export default AdminLogin;
