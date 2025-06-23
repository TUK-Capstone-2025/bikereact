// src/components/Navbar.js
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getMyPage } from "./Auth";
import { testUser } from "./dummyData";
import "../Styles/Desktop/Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/signin" || location.pathname === "/signup";
  const isRidePage = /^\/(myride|ride)\/\d+/.test(location.pathname);

  useEffect(() => {
    const loadUser = async () => {
      const currentUserId = localStorage.getItem("userId") || "";
      if (currentUserId === testUser.userId) {
        setUser({
          nickname: testUser.nickname,
          profileImage: testUser.profileImageUrl,
        });
        return;
      }
      try {
        const res = await getMyPage();
        if (res.success) {
          const data = res.data;
          setUser({
            nickname: data.nickname,
            profileImage: data.profileImageUrl || "/default_profilePic.svg",
          });
        }
      } catch {
        // ignore
      }
    };
    if (!isLoginPage) loadUser();
  }, [isLoginPage]);

  const handleToggleBike = () => {
    window.dispatchEvent(new Event("toggleBicycleOverlay"));
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          SFBRA WebService
        </div>

        {!isLoginPage && (
          <div className="navbar-buttons">
            {isRidePage && (
              <button
                className="bike-toggle-button"
                onClick={handleToggleBike}
                title="자전거 도로 토글"
              >
                🚴
              </button>
            )}
            <button
              className={`menu-button ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        )}
      </nav>

      {!isLoginPage && (
        <div className={`menu-overlay ${menuOpen ? "open" : ""}`}>
          <div className="menu">
            {user && (
              <div className="menu-header">
                <img
                  src={user.profileImage}
                  alt="프로필"
                  className="menu-profile-img"
                />
                <span className="menu-nickname">{user.nickname}</span>
              </div>
            )}
            <Link to="/mypage" onClick={() => setMenuOpen(false)}>
              마이페이지
            </Link>
            {/* replaced "사용 약관" with "나의 팀" */}
            <Link to="/my-team" onClick={() => setMenuOpen(false)}>
              나의 팀
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
