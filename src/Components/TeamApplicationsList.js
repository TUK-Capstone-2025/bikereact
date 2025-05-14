import React, { useEffect, useState } from "react";
import { getTeamApplications } from "./Auth";
import { Link } from "react-router-dom";

const TeamApplicationsList = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await getTeamApplications();
                if (res.success) {
                    setApplicants(res.data);
                } else {
                    setError("신청자 목록을 불러오지 못했습니다.");
                }
            } catch (err) {
                setError("오류 발생: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, []);

    if (loading) return <p>신청자 목록을 불러오는 중입니다...</p>;
    if (error) return <p>{error}</p>;

    if (applicants.length === 0) return <p>신청자가 없습니다.</p>;

    return (
        <div className="team-applications-list">
            <h3>팀 참가 신청자</h3>
            <ul>
                {applicants.map((applicant) => (
                    <li key={applicant.memberId}>
                        <Link to={`/member/${applicant.memberId}`}>
                            {applicant.nickname} ({applicant.name})
                        </Link>
                        {/* 수락/거절 버튼은 후속 구현 가능 */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamApplicationsList;
