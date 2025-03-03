import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current page URL

  const isLoginPage = location.pathname === "/login"; // Check if it's the login page

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>🚴‍♂️ BikeApp</div>

        {/* ✅ Hide menu button on login page */}
        {!isLoginPage && (
          <button
            className={`menu-button ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        )}
      </nav>

      {/* Animated Menu */}
      {!isLoginPage && (
        <div className={`menu-overlay ${menuOpen ? "open" : ""}`}>
          <div className="menu">
            <Link to="/social" onClick={() => setMenuOpen(false)}>Social</Link>
            <Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link>
            <Link to="/mypage" onClick={() => setMenuOpen(false)}>My Page</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
