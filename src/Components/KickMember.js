import React from "react";
import { kickMemberFromTeam } from "./Auth";

const KickMember = ({ memberId, nickname, onKickSuccess }) => {
    const handleKick = async () => {
        const confirmed = window.confirm(`${nickname} 님을 팀에서 퇴출하시겠습니까?`);
        if (!confirmed) return;

        try {
            const res = await kickMemberFromTeam(memberId);
            if (res.success) {
                alert("퇴출이 완료되었습니다.");
                if (onKickSuccess) onKickSuccess(); // 목록 갱신
            } else {
                alert(res.message || "퇴출에 실패했습니다.");
            }
        } catch (err) {
            alert("퇴출 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <button onClick={handleKick} style={{ marginLeft: "10px" }}>
            퇴출
        </button>
    );
};

export default KickMember;
