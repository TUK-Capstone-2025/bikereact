// src/components/MyTeam.js
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myNickname, setMyNickname] = useState(null);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      const currentUserId = localStorage.getItem("userId") || "";

      // ── 웹테스트 모드 ──
      if (currentUserId === testUser.userId) {
        setMyNickname(testUser.nickname);
        setTeamDetail(dummyTeamDetail);
        setLoading(false);
        return;
      }

      try {
        // (1) 내 정보
        const meRes = await getMyPage();
        setMyNickname(meRes.data.nickname);

        // (2) 내가 속한 팀
        const teamRes = await getMyTeam();
        if (!teamRes.success || !teamRes.data.isInTeam) {
          setTeamDetail(null);
          setLoading(false);
          return;
        }

        // (3) 팀 상세
        const detailRes = await getTeamDetail(teamRes.data.teamId);
        if (!detailRes.success) throw new Error("팀 상세 조회 실패");

        // (4) 서버가 members 대신 sortedMembersByDistance로 보낸다면 그걸 사용
        const rawMembers =
          detailRes.data.sortedMembersByDistance ||
          detailRes.data.members ||
          [];

        // (5) 프로필 이미지 추가
        const membersWithProfile = await Promise.all(
          rawMembers.map(async (m) => {
            try {
              const prof = await getMemberProfile(m.memberId);
              return {
                ...m,
                profileImageUrl: prof.data.profileImageUrl,
              };
            } catch {
              return { ...m, profileImageUrl: null };
            }
          })
        );

        setTeamDetail({
          ...detailRes.data,
          members: membersWithProfile,
        });
      } catch (err) {
        setError(err.message || "알 수 없는 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamInfo();
  }, []);

  if (loading)
    return <p className="loading-text">팀 정보를 불러오는 중입니다...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!teamDetail)
    return (
      <div className="no-team">
        <h2>소속된 팀이 없습니다.</h2>
        <p>팀에 참가하거나 새로운 팀을 만드세요.</p>
      </div>
    );

  const { name, leader, memberCount, members } = teamDetail;
  // 리더 정보 찾기
  const leaderInfo = members.find(
    (m) => m.memberId.toString() === leader.toString()
  );
  const isLeader = leaderInfo?.nickname === myNickname;

  return (
    <div className="team-info">
      <h2>{name}</h2>
      <p>
        <strong>팀 리더:</strong>{" "}
        {leaderInfo ? leaderInfo.nickname : `(ID: ${leader})`}
      </p>
      <p>
        <strong>팀원 수:</strong> {memberCount}
      </p>

      <h3>팀원 목록:</h3>
      <ul>
        {members.map((member, idx) => {
          const isTeamLeader =
            member.memberId.toString() === leader.toString();
          // 순위 메달 결정
          let medal = null;
          if (idx === 0) medal = "🥇";
          else if (idx === 1) medal = "🥈";
          else if (idx === 2) medal = "🥉";

          return (
            <li
              key={member.memberId}
              className={`team-member-item${isTeamLeader ? " leader" : ""}`}
            >
              {/* 프로필 썸네일 */}
              <img
                src={member.profileImageUrl || DEFAULT_AVATAR}
                alt={`${member.nickname} 프로필`}
                className="member-thumbnail"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }}
              />

              {/* 메달·닉네임·왕관 한 줄 */}
              <div className="member-info">
                {medal && <span className="medal-icon">{medal}</span>}
                <span className="member-nickname">{member.nickname}</span>
                <span className="member-name">({member.name})</span>
              </div>

              {/* 버튼 그룹 */}
              <div className="member-actions">
                <Link to={`/member/${member.memberId}`}>
                  <button className="profile-button">프로필 보기</button>
                </Link>
                {isLeader && (
                  <KickMember
                    memberId={member.memberId}
                    nickname={member.nickname}
                    onKickSuccess={() => window.location.reload()}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {isLeader && <TeamApplicationsList />}
    </div>
  );
};

export default MyTeam;
