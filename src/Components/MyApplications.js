import React, { useEffect, useState } from "react";
import { getApplyList, cancelTeamApplication } from "./Auth";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        try {
            const res = await getApplyList();
            if (res.success) {
                setApplications(res.data);
            } else {
                throw new Error("신청 내역을 불러오지 못했습니다.");
            }
        } catch (err) {
            setError(err.message || "오류 발생");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleCancel = async (teamId) => {
        if (!window.confirm("정말로 이 팀 신청을 취소하시겠습니까?")) return;

        try {
            const res = await cancelTeamApplication(teamId);
            if (res.success) {
                alert("신청이 취소되었습니다.");
                fetchApplications(); // 목록 갱신
            } else {
                alert(res.message || "취소 실패");
            }
        } catch (error) {
            alert("취소 도중 오류가 발생했습니다.");
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "APPROVE":
                return "승인됨";
            case "WAITING":
                return "대기 중";
            case "REJECT":
                return "거절됨";
            default:
                return "알 수 없음";
        }
    };

    if (loading) return <p>신청 내역을 불러오는 중입니다...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="my-applications-container">
            <h2>내 팀 신청 내역</h2>
            {applications.length === 0 ? (
                <p>신청한 팀이 없습니다.</p>
            ) : (
                <ul>
                    {applications.map((team) => (
                        <li key={team.teamId}>
                            <strong>{team.teamName}</strong>
                            <p>팀 ID: {team.teamId}</p>
                            <p>신청 상태: {getStatusLabel(team.status)}</p>
                            {team.status === "WAITING" && (
                                <button onClick={() => handleCancel(team.teamId)}>
                                    신청 취소
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyApplications;
