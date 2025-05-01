import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyPage } from "./Auth"; // Auth.js에서 가져오기
import "../Styles/Desktop/MyPage.css";

const MyPage = ({ onSignIn }) => {
    const [nickname, setNickname] = useState("");
    const [userId, setUserId] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getMyPage();
                const userData = response?.data;

                if (userData) {
                    setNickname(userData.nickname || ""); // 백엔드 응답에 따라 키 이름 조정
                    setUserId(userData.userId || "");
                    setProfileImage(userData.profileImage || null);
                }
            } catch (error) {
                console.error("마이페이지 데이터 불러오기 실패:", error);
                // 로그인이 안 된 상태라면 로그인 페이지로 이동
                navigate("/signin");
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        if (onSignIn) onSignIn(false); // App.js에서 로그인 상태 관리하는 경우
        navigate("/signin");
    };

    return (
        <div className="mypage-container">
            <div className="profile-section">
                <img
                    src={profileImage || "/default_profilePic.svg"}
                    alt="프로필"
                    className="profile-image"
                />
                <p><strong>닉네임:</strong> {nickname}</p>
                <p><strong>아이디:</strong> {userId}</p>
            </div>

            <div className="button-section">
                <button onClick={() => navigate("/change-profile-image")}>프로필 사진 변경</button>
                <button onClick={() => navigate("/change-nickname")}>닉네임 변경</button>
                <button onClick={() => navigate("/change-id")}>아이디 변경</button>
                <button onClick={() => navigate("/change-password")}>비밀번호 변경</button>
            </div>
            <button className="logout-button" onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default MyPage;
