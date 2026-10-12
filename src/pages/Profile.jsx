
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  Save,
  ArrowLeft,
  LockKeyhole,
  Pencil,
  X,
} from "lucide-react";
import api from "./api";
import "./Profile.css";

const emptyPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState(emptyPassword);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const getToken = () => localStorage.getItem("spFancyToken");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = getToken();

    if (!token) {
      setError("Please login to view your profile.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.user;

      const details = {
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      };

      setProfile(details);
      setFormData(details);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setEditing(false);
    setError("");
    setMessage("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = getToken();

    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        "/profile/me",
        {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      const details = {
        fullName: updatedUser.fullName || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
      };

      setProfile(details);
      setFormData(details);
      setEditing(false);
      setMessage(
        response.data.message || "Profile updated successfully"
      );

      try {
        const savedUser = localStorage.getItem("spFancyUser");

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);

          localStorage.setItem(
            "spFancyUser",
            JSON.stringify({
              ...parsedUser,
              ...updatedUser,
            })
          );
        }
      } catch {
        // Cached user data is optional.
      }

      window.dispatchEvent(new Event("spFancyProfileUpdated"));
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from current password."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setPasswordError("Session expired. Please login again.");
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await api.put(
        "/profile/change-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordMessage(
        response.data.message || "Password updated successfully"
      );

      setPasswordData({ ...emptyPassword });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to update password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-card profile-status">
          Loading your profile...
        </div>
      </main>
    );
  }

  if (error && !profile.fullName && !profile.email) {
    return (
      <main className="profile-page">
        <div className="profile-card profile-status">
          <p className="profile-error">{error}</p>
          <button
            type="button"
            className="profile-primary-btn"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
          <button
            type="button"
            className="profile-back-btn"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <button
          type="button"
          className="profile-back-btn"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <header className="profile-heading">
          <div className="profile-avatar">
            <UserRound size={36} />
          </div>
          <div>
            <h1>My Profile</h1>
            <p>Manage your SP Fancy account details</p>
          </div>
        </header>

        <section className="profile-card">
          <div className="profile-card-heading">
            <div>
              <h2>Personal Information</h2>
              <p>View and update your details</p>
            </div>

            {!editing && (
              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => {
                  setFormData(profile);
                  setEditing(true);
                  setMessage("");
                  setError("");
                }}
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {message && (
            <p className="profile-success" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="profile-error" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="profile-fields">
              <div className="profile-field">
                <label htmlFor="fullName">Full Name</label>
                <div className="profile-input-wrap">
                  <UserRound size={18} />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={editing ? formData.fullName : profile.fullName}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    maxLength={100}
                    disabled={!editing || saving}
                    required
                  />
                </div>
              </div>

              <div className="profile-field">
                <label htmlFor="email">Email Address</label>
                <div className="profile-input-wrap">
                  <Mail size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={editing ? formData.email : profile.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    disabled={!editing || saving}
                    required
                  />
                </div>
              </div>

              <div className="profile-field">
                <label htmlFor="phone">Phone Number</label>
                <div className="profile-input-wrap">
                  <Phone size={18} />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={editing ? formData.phone : profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                    maxLength={20}
                    disabled={!editing || saving}
                    required
                  />
                </div>
              </div>
            </div>

            {editing && (
              <div className="profile-actions">
                <button
                  type="submit"
                  className="profile-primary-btn"
                  disabled={saving}
                >
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <X size={17} />
                  Cancel
                </button>
              </div>
            )}
          </form>
        </section>

        <section className="profile-card password-section">
          <div className="profile-card-heading">
            <div>
              <h2>Change Password</h2>
              <p>Keep your account secure</p>
            </div>
            <div className="password-icon">
              <LockKeyhole size={23} />
            </div>
          </div>

          {passwordMessage && (
            <p className="profile-success" role="status">
              {passwordMessage}
            </p>
          )}

          {passwordError && (
            <p className="profile-error" role="alert">
              {passwordError}
            </p>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="profile-fields">
              <div className="profile-field">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  className="password-input"
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInput}
                  placeholder="Enter current password"
                  disabled={passwordLoading}
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="newPassword">New Password</label>
                <input
                  className="password-input"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInput}
                  placeholder="At least 8 characters"
                  minLength={8}
                  disabled={passwordLoading}
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <input
                  className="password-input"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInput}
                  placeholder="Re-enter new password"
                  minLength={8}
                  disabled={passwordLoading}
                  required
                />
              </div>
            </div>

            <div className="profile-actions">
              <button
                type="submit"
                className="profile-primary-btn"
                disabled={passwordLoading}
              >
                <LockKeyhole size={17} />
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Profile;
