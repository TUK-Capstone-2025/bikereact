import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { testUser } from "./dummyData";
import "../Styles/Desktop/MyPage.css";

const MyPage = ({ onSignIn }) => {
    const [nickname, setNickname] = useState("");
    const [userId, setUserId] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        if (currentUserId === testUser.userId) {
            setNickname("테스트 유저");
            setUserId(testUser.userId);
        } else {
            // TODO: 실제 백엔드에서 /api/member/me 로 사용자 정보 로딩
        }
    }, [currentUserId]);

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
