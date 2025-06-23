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
      setLoading(true);
      try {
        const res = await getTeamDetail(teamId);
        if (!res.success) throw new Error(res.message || "팀 정보를 불러오지 못했습니다.");
        setTeam(res.data);
      } catch (err) {
        setError(err.message || "팀 정보 조회 실패");
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

  if (loading) return <p className="loading-text">팀 정보를 불러오는 중입니다...</p>;
  if (error)   return <p className="error-text">{error}</p>;
  if (!team)   return null;

  // 서버 응답에 members 대신 sortedMembersByDistance 로 넘어오면 이쪽을 사용
  const members = team.sortedMembersByDistance || [];

  return (
    <div className="apply-team-container">
      <h2 className="title">팀 참가 신청</h2>
      <div className="team-info">
        <h3 className="team-name">{team.name}</h3>
        <p className="team-desc">
          <strong>설명:</strong> {team.description || "설명 없음"}
        </p>
        <p className="team-count">
          <strong>팀원 수:</strong> {team.memberCount}명
        </p>
      </div>

      <h4 className="member-list-title">팀원 목록</h4>
      {members.length === 0 ? (
        <p className="no-members">참여한 팀원이 없습니다.</p>
      ) : (
        <ul className="team-member-list">
          {members.map((m, idx) => (
            <li key={m.memberId} className="team-member-item">
              <span className="member-nickname">
                {m.nickname} ({m.userId})
              </span>
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleApply} className="apply-button">
        이 팀에 참가 신청
      </button>

      {status && <p className="success-text">{status}</p>}
      {error  && <p className="error-text">{error}</p>}
    </div>
  );
};

export default ApplyTeam;
