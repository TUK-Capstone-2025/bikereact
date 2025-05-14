import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeamDetail, applyToTeam, getMemberProfile } from "./Auth";

const ApplyTeam = () => {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await getTeamDetail(teamId);
                if (!res.success) throw new Error("팀 정보를 불러오지 못했습니다.");

                const membersWithProfiles = await Promise.all(
                    res.data.members.map(async (member) => {
                        try {
                            const profileRes = await getMemberProfile(member.memberId);
                            return {
                                ...member,
                                profileImageUrl:
                                    profileRes.success && profileRes.data.profileImageUrl
                                        ? profileRes.data.profileImageUrl
                                        : null
                            };
                        } catch {
                            return { ...member, profileImageUrl: null };
                        }
                    })
                );

                setTeam({ ...res.data, members: membersWithProfiles });
            } catch (err) {
                setError("팀 정보 조회 실패");
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [teamId]);

    const handleApply = async () => {
        try {
            const res = await applyToTeam(teamId);
            if (res.success) {
                setStatus("신청이 완료되었습니다.");
            } else {
                setError(res.message || "신청 실패");
            }
        } catch (err) {
            setError("신청 도중 오류가 발생했습니다.");
        }
    };

    if (loading) return <p>팀 정보를 불러오는 중입니다...</p>;
    if (error) return <p>{error}</p>;

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
                        <Link to={`/member/${member.memberId}`} className="member-link">
                            <img
                                src={member.profileImageUrl || "/default_profilePic.svg"}
                                alt={`${member.nickname} 프로필`}
                                className="member-profile-img"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/default_profilePic.svg";
                                }}
                            />
                            <span>{member.nickname} ({member.name})</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <button onClick={handleApply}>이 팀에 참가 신청</button>

            {status && <p className="success-text">{status}</p>}
            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

export default ApplyTeam;
