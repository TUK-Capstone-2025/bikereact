// ApplyTeam.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeamDetail, applyToTeam } from "./Auth";
import "../Styles/Desktop/ApplyTeam.css";

const ApplyTeam = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await getTeamDetail(teamId);
        if (!res.success) throw new Error("팀 정보를 불러오지 못했습니다.");
        setTeam(res.data);
      } catch {
        setError("팀 정보 조회 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [teamId]);

  const handleApply = async () => {
    setError("");
    try {
      const res = await applyToTeam(teamId);
      if (res.success) {
        setStatus("신청이 완료되었습니다.");
      } else {
        setError(res.message || "신청 실패");
      }
    } catch {
      setError("신청 도중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>팀 정보를 불러오는 중입니다...</p>;
  if (error)   return <p className="error-text">{error}</p>;

  return (
    <div className="apply-team-container">
      <h2>팀 참가 신청</h2>
      <h3>{team.name}</h3>
      <p><strong>설명:</strong> {team.description || "설명 없음"}</p>
      <p><strong>팀원 수:</strong> {team.memberCount}명</p>

      <h4>팀원 목록</h4>
      <ul className="team-member-list">
        {team.members.map((member) => (
          <li key={member.memberId} className="team-member-item">
            <span>
              {member.nickname} ({member.name})
            </span>
          </li>
        ))}
      </ul>

      <button onClick={handleApply} className="apply-button">
        이 팀에 참가 신청
      </button>

      {status && <p className="success-text">{status}</p>}
      {error  && <p className="error-text">{error}</p>}
    </div>
  );
};

export default ApplyTeam;
