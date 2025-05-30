import React from "react";
import "../Styles/Desktop/Social.css";
import { useNavigate } from "react-router-dom";

const Social = () => {
  const navigate = useNavigate();

  return (
    <div className="social-container">
      <div className="button-container" onClick={() => navigate("/my-team")}> 
        <div className="button-title">나의 팀</div>
        <div className="button-subtitle">내가 속한 팀을 확인합니다.</div>
      </div>
      <div className="button-container" onClick={() => navigate("/create-team")}> 
        <div className="button-title">팀 만들기</div>
        <div className="button-subtitle">새로운 팀을 만듭니다.</div>
      </div>

      <div className="button-container" onClick={() => navigate("/team/list")}>
        <div className="button-title">팀 참가하기</div>
        <div className="button-subtitle">기존 팀에 참가합니다.</div>
      </div>
      <div className="button-container" onClick={() => navigate("/my-applications")}>
        <div className="button-title">신청 내역 보기</div>
        <div className="button-subtitle">내가 신청한 팀 목록을 확인합니다.</div>
      </div>
    </div>
  );
};

export default Social;
