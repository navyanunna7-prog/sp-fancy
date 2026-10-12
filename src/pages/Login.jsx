import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

     const response = await api.post(
  "/auth/login",
  {
    email: formData.email,
    password: formData.password,
  }
);

      // Save JWT token
      localStorage.setItem(
        "spFancyToken",
        response.data.token
      );

      // Save login status
      localStorage.setItem(
        "spFancyLoggedIn",
        "true"
      );

      // Save user information
      localStorage.setItem(
        "spFancyUser",
        JSON.stringify(response.data.user)
      );

      navigate("/home", { replace: true });

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        <div className="auth-brand">
          <p className="section-label">WELCOME BACK</p>

          <h1>
            Welcome to
            <br />
            <span>SP FANCY.</span>
          </h1>

          <p>
            Sign in to your account and continue
            exploring jewellery, handbags, slippers
            and beautiful accessories.
          </p>

          <div className="auth-brand-line"></div>

          <span>STYLE • BEAUTY • ELEGANCE</span>
        </div>

        <div className="auth-form-box">

          <div className="auth-form-heading">
            <p className="section-label">YOUR ACCOUNT</p>

            <h2>Sign In</h2>

            <p>
              Enter your details to access your account.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="auth-input-group">
              <label>Email Address</label>

              <div className="auth-input-wrapper">
                <Mail size={17} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-input-group">

              <div className="password-label-row">
                <label>Password</label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    alert(
                      "Password reset will be added later."
                    )
                  }
                >
                  Forgot Password?
                </button>
              </div>

              <div className="auth-input-wrapper">
                <Lock size={17} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label="Show or hide password"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading
                ? "SIGNING IN..."
                : "SIGN IN"}
            </button>

          </form>

          <div className="auth-register">
            <p>Don't have an account?</p>

            <Link to="/register">
              CREATE ACCOUNT
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Login;
