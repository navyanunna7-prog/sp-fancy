import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("http://localhost:5000/api/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      alert("Registration successful! 🎉");

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        <div className="auth-brand">
          <p className="section-label">JOIN SP FANCY</p>

          <h1>
            Create your
            <br />
            <span>SP FANCY.</span>
            <br />
            account.
          </h1>

          <p>
            Create your account and discover
            jewellery, handbags, slippers and
            beautiful accessories.
          </p>

          <div className="auth-brand-line"></div>

          <span>STYLE • BEAUTY • ELEGANCE</span>
        </div>

        <div className="auth-form-box">

          <div className="auth-form-heading">
            <p className="section-label">YOUR ACCOUNT</p>

            <h2>Create Account</h2>

            <p>
              Enter your details to get started.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="auth-input-group">
              <label>Full Name</label>

              <div className="auth-input-wrapper">
                <User size={17} />

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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

            {/* Phone */}
            <div className="auth-input-group">
              <label>Phone Number</label>

              <div className="auth-input-wrapper">
                <Phone size={17} />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <label>Password</label>

              <div className="auth-input-wrapper">
                <Lock size={17} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
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
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="auth-input-group">
              <label>Confirm Password</label>

              <div className="auth-input-wrapper">
                <Lock size={17} />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
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
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>

          </form>

          <div className="auth-register">
            <p>Already have an account?</p>

            <Link to="/login">
              SIGN IN
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Register;