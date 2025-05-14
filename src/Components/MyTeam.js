import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyTeam, getTeamDetail, getMemberProfile, getMyPage } from "./Auth";
import TeamApplicationsList from "./TeamApplicationsList";
import KickMember from "./KickMember";

const MyTeam = () => {
    const [teamDetail, setTeamDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myNickname, setMyNickname] = useState(null);

    useEffect(() => {
        const fetchTeamInfo = async () => {
            try {
                const meRes = await getMyPage(); // 내 정보
                const nickname = meRes?.data?.nickname;
                setMyNickname(nickname);

                const teamRes = await getMyTeam();
                if (!teamRes.success || !teamRes.data.isInTeam) {
                    setTeamDetail(null);
                    return;
                }

                const detailRes = await getTeamDetail(teamRes.data.teamId);
                if (!detailRes.success) {
                    throw new Error("팀 상세 정보 조회 실패");
                }

                const membersWithProfile = await Promise.all(
                    detailRes.data.members.map(async (member) => {
                        try {
                            const profileRes = await getMemberProfile(member.memberId);
                            if (profileRes.success) {
                                return { ...member, profileImageUrl: profileRes.data.profileImageUrl };
                            }
                        } catch {}
                        return { ...member, profileImageUrl: null };
                    })
                );

                setTeamDetail({ ...detailRes.data, members: membersWithProfile });
            } catch (err) {
                setError(err.message || "알 수 없는 오류 발생");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamInfo();
    }, []);

    if (loading) return <p className="loading-text">팀 정보를 불러오는 중입니다...</p>;
    if (error) return <p className="error-text">{error}</p>;
    if (!teamDetail) {
        return (
            <div className="no-team">
                <h2>소속된 팀이 없습니다.</h2>
                <p>팀에 참가하거나 새로운 팀을 만드세요.</p>
            </div>
        );
    }

    const { name, leader, memberCount, members } = teamDetail;
    const leaderInfo = members.find((m) => m.memberId.toString() === leader.toString());
    const isLeader = leaderInfo?.nickname === myNickname;

    return (
        <div className="team-info">
            <h2>{name}</h2>
            <p><strong>팀 리더:</strong> {leaderInfo ? leaderInfo.nickname : `(ID: ${leader})`}</p>
            <p><strong>팀원 수:</strong> {memberCount}</p>
            <h3>팀원 목록:</h3>
            <ul>
                {members.map((member) => (
                    <li key={member.memberId} className="team-member-item">
                        {member.profileImageUrl && (
                            <img
                                src={member.profileImageUrl}
                                alt={`${member.nickname} 프로필`}
                                className="member-thumbnail"
                            />
                        )}
                        {member.nickname} ({member.name})
                        <Link to={`/member/${member.memberId}`}>
                            <button>프로필 보기</button>
                        </Link>
                        {/* 🔹 리더는 자신 포함 모든 멤버 퇴출 가능 (일시적으로) */}
                        {isLeader && (
                            <KickMember
                                memberId={member.memberId}
                                nickname={member.nickname}
                                onKickSuccess={() => window.location.reload()}
                            />
                        )}
                    </li>
                ))}
            </ul>

            {/* 🔹 리더일 경우만 신청자 목록 표시 */}
            {isLeader && <TeamApplicationsList />}
        </div>
    );
};

export default MyTeam;
