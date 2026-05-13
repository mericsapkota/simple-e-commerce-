import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { ShoppingBag } from "lucide-react";

const Header = () => {
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="pp-nav">
      <div className="pp-nav-inner">
        <div className="pp-nav-brand">
          <Link to="/" className="pp-logo">
            <span className="pp-logo-icon">
              <ShoppingBag />
            </span>

            <span className="pp-logo-text">Lumina</span>
          </Link>
          <div className="pp-nav-links">
            <Link to="/dashboard" className={`pp-nav-link ${isActive("/dashboard") ? "pp-nav-link--active" : ""}`}>
              Dashboard
            </Link>
            <Link to="/products" className={`pp-nav-link ${isActive("/products") ? "pp-nav-link--active" : ""}`}>
              Products
            </Link>
            <Link to="/orders" className={`pp-nav-link ${isActive("/orders") ? "pp-nav-link--active" : ""}`}>
              Orders
            </Link>
          </div>
        </div>
        <button onClick={logout} className="pp-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
