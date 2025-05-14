import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeamList } from "./Auth";

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await getTeamList();
                if (res.success) {
                    setTeams(res.data);
                    setFilteredTeams(res.data);
                } else {
                    throw new Error("팀 목록을 불러오지 못했습니다.");
                }
            } catch (err) {
                setError(err.message || "알 수 없는 오류");
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    useEffect(() => {
        const keyword = searchTerm.toLowerCase();
        const results = teams.filter(team =>
            team.name.toLowerCase().includes(keyword)
        );
        setFilteredTeams(results);
    }, [searchTerm, teams]);

    if (loading) return <p>팀 목록을 불러오는 중입니다...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="team-list-container">
            <h2>팀 목록</h2>
            <input
                type="text"
                placeholder="팀 이름 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredTeams.length === 0 ? (
                <p>일치하는 팀이 없습니다.</p>
            ) : (
                <ul>
                    {filteredTeams.map((team) => (
                        <li key={team.teamId} className="team-list-item">
                            <div className="team-info">
                                <strong>{team.name}</strong>
                                <p>팀 ID: {team.teamId}</p>
                            </div>
                            <Link to={`/apply-team/${team.teamId}`}>
                                <button>참가 신청</button>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TeamList;
