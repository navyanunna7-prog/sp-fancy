
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchText.trim();

    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);

    setSearchOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("spFancyLoggedIn");
    localStorage.removeItem("spFancyToken");
    localStorage.removeItem("spFancyUser");

    setMenuOpen(false);
    setSearchOpen(false);

    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* LOGO */}
        <Link to="/home" className="logo" onClick={closeMenu}>
          SP <span>FANCY</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="nav-links">
          <NavLink to="/home" className={navLinkClass}>
            HOME
          </NavLink>

          <NavLink to="/shop" className={navLinkClass}>
            SHOP
          </NavLink>

          <Link
            to="/shop?category=jewellery"
            className="nav-link"
            onClick={closeMenu}
          >
            JEWELLERY
          </Link>

          <Link
            to="/shop?category=slippers"
            className="nav-link"
            onClick={closeMenu}
          >
            SLIPPERS
          </Link>

          <Link
            to="/shop?category=handbags"
            className="nav-link"
            onClick={closeMenu}
          >
            HANDBAGS
          </Link>

          <Link
            to="/shop?category=accessories"
            className="nav-link"
            onClick={closeMenu}
          >
            ACCESSORIES
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="nav-actions">
          {/* SEARCH */}
          <button
            type="button"
            className="nav-icon-btn"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label={searchOpen ? "Close search" : "Search"}
            title="Search"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* MY PROFILE */}
          <Link
            to="/profile"
            className="nav-icon-btn"
            aria-label="My Profile"
            title="My Profile"
            onClick={closeMenu}
          >
            <UserRound size={20} />
          </Link>

          {/* MY ORDERS */}
          <Link
            to="/orders"
            className="nav-link desktop-only"
            onClick={closeMenu}
          >
            MY ORDERS
          </Link>

          {/* WISHLIST */}
          <Link
            to="/wishlist"
            className="nav-icon-btn"
            aria-label="Wishlist"
            title="Wishlist"
            onClick={closeMenu}
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="nav-count">{wishlistCount}</span>
            )}
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            className="nav-icon-btn"
            aria-label="Cart"
            title="Cart"
            onClick={closeMenu}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="nav-count">{cartCount}</span>
            )}
          </Link>

          {/* LOGOUT */}
          <button
            type="button"
            className="nav-logout-btn desktop-only"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
            <span>LOGOUT</span>
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="nav-icon-btn mobile-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      {searchOpen && (
        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <Search size={18} />

            <input
              type="text"
              placeholder="Search jewellery, handbags, slippers..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoFocus
              aria-label="Search products"
            />
          </form>
        </div>
      )}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-nav">
          <Link to="/home" onClick={closeMenu}>
            HOME
          </Link>

          <Link to="/shop" onClick={closeMenu}>
            SHOP
          </Link>

          <Link
            to="/shop?category=jewellery"
            onClick={closeMenu}
          >
            JEWELLERY
          </Link>

          <Link
            to="/shop?category=slippers"
            onClick={closeMenu}
          >
            SLIPPERS
          </Link>

          <Link
            to="/shop?category=handbags"
            onClick={closeMenu}
          >
            HANDBAGS
          </Link>

          <Link
            to="/shop?category=accessories"
            onClick={closeMenu}
          >
            ACCESSORIES
          </Link>

          <Link to="/profile" onClick={closeMenu}>
            <UserRound size={17} />
            MY PROFILE
          </Link>

          <Link to="/orders" onClick={closeMenu}>
            MY ORDERS
          </Link>

          <Link to="/wishlist" onClick={closeMenu}>
            <Heart size={17} />
            WISHLIST
            {wishlistCount > 0 && ` (${wishlistCount})`}
          </Link>

          <Link to="/cart" onClick={closeMenu}>
            <ShoppingBag size={17} />
            CART
            {cartCount > 0 && ` (${cartCount})`}
          </Link>

          <button
            type="button"
            className="mobile-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            LOGOUT
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
