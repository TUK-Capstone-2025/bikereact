import React, { useState, useEffect } from "react";
import { getMyTeam } from "./Auth"; // Auth.js에서 작성한 함수
//import "../Styles/Desktop/MyTeam.css";

const MyTeam = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const data = await getMyTeam();
                if (data.success) {
                    setTeam(data.data); // 팀 정보가 있을 경우 설정
                } else {
                    setError("팀 정보 조회에 실패했습니다.");
                }
            } catch (err) {
                setError(err.message); // 오류 메시지 설정
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    if (loading) {
        return <p className="loading-text">팀 정보를 불러오는 중입니다...</p>;
    }

    return (
        <div className="my-team-container">
            {error ? (
                <p className="error-text">{error}</p>
            ) : !team ? (
                <div className="no-team">
                    <h2>소속된 팀이 없습니다.</h2>
                    <p>팀에 참가하거나 새로운 팀을 만드세요.</p>
                </div>
            ) : (
                <div className="team-info">
                    <h2>{team.name}</h2>
                    <p><strong>팀 리더:</strong> {team.leader}</p>
                    <p><strong>팀원 수:</strong> {team.members.length}</p>
                </div>
            )}
        </div>
    );
};

export default MyTeam;
