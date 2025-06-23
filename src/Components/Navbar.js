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
  const DEFAULT_AVATAR = "/default_profilePic.svg";

  const isLoginPage =
    location.pathname === "/signin" || location.pathname === "/signup";
  const isMyRidePage = /^\/myride\/\d+/.test(location.pathname);

  useEffect(() => {
    const loadUser = async () => {
      const currentUserId = localStorage.getItem("userId") || "";
      if (currentUserId === testUser.userId) {
        setUser({
          nickname: testUser.nickname,
          profileImageUrl: testUser.profileImageUrl,
        });
        return;
      }
      try {
        const res = await getMyPage();
        if (res.success) {
          const data = res.data;
          setUser({
            nickname: data.nickname,
            // 여기 key를 profileImageUrl 로 맞춰줍니다
            profileImageUrl: data.profileImageUrl || "/default_profilePic.svg",
          });
        }
      } catch {
        // 비로그인 시 무시
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
            {isMyRidePage && (
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
                  src={user.profileImageUrl}
                  alt="프로필"
                  className="menu-profile-img"
                />
                <span className="menu-nickname">{user.nickname}</span>
              </div>
            )}
            <Link to="/mypage" onClick={() => setMenuOpen(false)}>
              마이페이지
            </Link>
            <Link to="/terms" onClick={() => setMenuOpen(false)}>
              사용 약관
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
