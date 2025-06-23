// MyPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyPage } from "./Auth";       // 실제 API 호출용
import { testUser } from "./dummyData";   // 더미 유저 정보
import "../Styles/Desktop/MyPage.css";

const MyPage = ({ onSignIn }) => {
  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      // 1) localStorage에서 현재 로그인된 userId 가져오기
      const currentUserId = localStorage.getItem("userId") || "";

      // 2) "웹 테스트 모드" 분기: userId가 "webtest"이면 dummy 데이터 사용
      if (currentUserId === testUser.userId) {
        setNickname(testUser.nickname);
        setUserId(testUser.userId);
        setProfileImage(testUser.profileImageUrl);
        return; // 더 이상 실제 API 호출을 하지 않음 → 리다이렉트 방지
      }

      // 3) 일반 모드: 기존 getMyPage() 호출
      try {
        const response = await getMyPage();
        const userData = response?.data;

        if (userData) {
          setNickname(userData.nickname || "");
          setUserId(userData.userId || "");
          setProfileImage(userData.profileImage || null);
        } else {
          // response.data가 없으면 로그인이 안 된 상태라 가정
          navigate("/signin");
        }
      } catch (error) {
        console.error("마이페이지 데이터 불러오기 실패:", error);
        // 로그인 토큰이 없거나 만료된 상태라면 로그인 페이지로 리다이렉트
        navigate("/signin");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    if (onSignIn) onSignIn(false);
    navigate("/signin");
  };

  return (
    <div className="mypage-container">
      <div className="profile-section">
        <img
          src={profileImage || "/default_profilePic.svg"}
          alt="프로필"
          className="profile-image"
          onError={(e) => (e.currentTarget.src = "/default_profilePic.svg")}
        />

        <p className="profile-row">
          <span className="profile-label">닉네임</span>
          <span className="profile-value">{nickname}</span>
        </p>
        <p className="profile-row">
          <span className="profile-label">아이디</span>
          <span className="profile-value">{userId}</span>
        </p>
      </div>

      <div className="button-section">
        <button onClick={() => navigate("/change-profile-image")}>
          프로필 사진 변경
        </button>
        <button onClick={() => navigate("/change-nickname")}>
          닉네임 변경
        </button>
        <button onClick={() => navigate("/change-id")}>아이디 변경</button>
        <button onClick={() => navigate("/change-password")}>
          비밀번호 변경
        </button>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
