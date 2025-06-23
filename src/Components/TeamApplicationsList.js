import React, { useState, useEffect } from "react";
import {
  getTeamApplications,
  approveMember,
  rejectMember,
} from "./Auth";
import "../Styles/Desktop/TeamApplicationsList.css";

const TeamApplicationsList = ({ onApproveOrReject }) => {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState(null);

  const fetchApps = async () => {
    try {
      const res = await getTeamApplications();
      if (res.success) {
        setApps(res.data);
      }
    } catch {
      setError("신청자 목록 조회 실패");
    }
  };

  useEffect(() => {
    fetchApps();
  }, []); // 화살표 안에 호출되므로 cleanup이 없습니다

  const handleApprove = async (memberId) => {
    try {
      const res = await approveMember(memberId);
      if (res.success) {
        await fetchApps();
        onApproveOrReject();
      } else {
        setError(res.message);
      }
    } catch {
      setError("승인 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async (memberId) => {
    try {
      const res = await rejectMember(memberId);
      if (res.success) {
        await fetchApps();
        onApproveOrReject();
      } else {
        setError(res.message);
      }
    } catch {
      setError("거절 중 오류가 발생했습니다.");
    }
  };

  if (error) return <p className="error-text">{error}</p>;
  if (!apps.length) return <p className="no-applicants">신청자가 없습니다.</p>;

  return (
    <div className="applications-list">
      <h3>팀 참가 신청자</h3>
      <ul>
        {apps.map((app) => (
          <li key={app.memberId} className="application-item">
            <span>{app.nickname} ({app.userId})</span>
            <button onClick={() => handleApprove(app.memberId)}>수락</button>
            <button onClick={() => handleReject(app.memberId)}>거절</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamApplicationsList;
