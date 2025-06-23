import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getMyTeam,
  getTeamDetail,
  getMemberProfile,
  getMyPage,
} from "./Auth";
import TeamApplicationsList from "./TeamApplicationsList";
import KickMember from "./KickMember";
import { testUser, dummyTeamDetail } from "./dummyData";
import "../Styles/Desktop/MyTeam.css";

const DEFAULT_AVATAR = "/default_profilePic.svg";

const MyTeam = () => {
  const [teamDetail, setTeamDetail] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [myNickname, setMyNickname] = useState(null);

  const fetchTeamInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUserId = localStorage.getItem("userId") || "";
      if (currentUserId === testUser.userId) {
        setMyNickname(testUser.nickname);
        setTeamDetail(dummyTeamDetail);
        return;
      }
      const meRes = await getMyPage();
      setMyNickname(meRes.data.nickname);

      const teamRes = await getMyTeam();
      if (!teamRes.success || !teamRes.data.isInTeam) {
        setTeamDetail(null);
        return;
      }

      const detailRes = await getTeamDetail(teamRes.data.teamId);
      if (!detailRes.success) throw new Error("팀 상세 조회 실패");

      const rawMembers =
        detailRes.data.sortedMembersByDistance ||
        detailRes.data.members ||
        [];

      const membersWithProfile = await Promise.all(
        rawMembers.map(async (m) => {
          try {
            const prof = await getMemberProfile(m.memberId);
            return { ...m, profileImageUrl: prof.data.profileImageUrl };
          } catch {
            return { ...m, profileImageUrl: null };
          }
        })
      );

      setTeamDetail({ ...detailRes.data, members: membersWithProfile });
    } catch (err) {
      setError(err.message || "알 수 없는 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 — 이렇게 래핑하세요
  useEffect(() => {
    fetchTeamInfo();
  }, []);

  if (loading)
    return <p className="loading-text">팀 정보를 불러오는 중입니다...</p>;
  if (error)
    return <p className="error-text">{error}</p>;
  if (!teamDetail)
    return (
      <div className="no-team">
        <h2>소속된 팀이 없습니다.</h2>
        <p>팀에 참가하거나 새로운 팀을 만드세요.</p>
      </div>
    );

  const { name, leader, memberCount, members } = teamDetail;
  const leaderId = leader.toString();
  const isLeader = members.some(
    (m) => m.memberId.toString() === leaderId && m.nickname === myNickname
  );

  return (
    <div className="team-info">
      <h2>{name}</h2>
      <p><strong>팀원 수:</strong> {memberCount}</p>

      {/* 팀원 목록 */}
      <ul className="team-members-list">
        {members.map((member, idx) => {
          const isTeamLeader = member.memberId.toString() === leaderId;
          let medal = "";
          if (idx === 0) medal = "🥇";
          else if (idx === 1) medal = "🥈";
          else if (idx === 2) medal = "🥉";

          return (
            <li
              key={member.memberId}
              className={`team-member-item${isTeamLeader ? " leader" : ""}`}
            >
              <img
                src={member.profileImageUrl || DEFAULT_AVATAR}
                alt={`${member.nickname} 프로필`}
                className="member-thumbnail"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }}
              />

              <div className="member-info">
                <span className="medal-icon">{medal}</span>
                <span className="member-nickname">{member.nickname}</span>
                {isTeamLeader && <span className="leader-crown">👑</span>}
              </div>

              <div className="member-actions">
                <Link to={`/member/${member.memberId}`}>
                  <button className="profile-button">프로필 보기</button>
                </Link>
                {isLeader && (
                  <KickMember
                    memberId={member.memberId}
                    nickname={member.nickname}
                    onKickSuccess={fetchTeamInfo}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {isLeader && (
        <TeamApplicationsList onApproveOrReject={fetchTeamInfo} />
      )}
    </div>
  );
};

export default MyTeam;
