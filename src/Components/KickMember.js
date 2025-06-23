// src/components/KickMember.js
import React from "react";
import { kickMemberFromTeam } from "./Auth";
// MyTeam.css 가 전역으로 로드되고 있다면 import 안 해도 됩니다.
// import "../Styles/Desktop/MyTeam.css";

const KickMember = ({ memberId, nickname, onKickSuccess }) => {
  const handleKick = async () => {
    const confirmed = window.confirm(`${nickname} 님을 팀에서 퇴출하시겠습니까?`);
    if (!confirmed) return;

    try {
      const res = await kickMemberFromTeam(memberId);
      if (res.success) {
        alert("퇴출이 완료되었습니다.");
        onKickSuccess?.();
      } else {
        alert(res.message || "퇴출에 실패했습니다.");
      }
    } catch {
      alert("퇴출 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <button
      className="kick-button"    // ← 여기에 클래스 추가
      onClick={handleKick}
    >
      퇴출
    </button>
  );
};

export default KickMember;
