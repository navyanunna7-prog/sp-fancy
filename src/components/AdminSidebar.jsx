
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Store,
} from "lucide-react";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("spFancyAdminToken");
    localStorage.removeItem("spFancyAdmin");

    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <Store size={24} />

        <div>
          <h2>SP FANCY</h2>
          <span>ADMIN PANEL</span>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          <Package size={19} />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          <ShoppingBag size={19} />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/admin/customers"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          <Users size={19} />
          <span>Customers</span>
        </NavLink>
      </nav>

      <button
        type="button"
        className="admin-sidebar-logout"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default AdminSidebar;
