import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Desktop/Main.css";

const Main = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("🔐 Access Token in MainPage:", token);
    if (!token) {
      console.error("❌ No token found! Redirecting to SignIn.");
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <div className="main-container">
        <button className="main-button" onClick={() => navigate("/myridelist")}>
  <div className="title">나의 주행 기록</div>
  <div className="subtitle">지금까지 주행한 기록을 살펴봅니다.</div>
</button>

        <button className="main-button" onClick={() => navigate("/social")}>
          <div className="title">소셜</div>
          <div className="subtitle">내가 소속된 팀을 조회하거나, 팀을 만들고 참가합니다.</div>
        </button>
    </div>
  );
};

export default Main;
