// src/components/MyApplications.js
import React, { useEffect, useState } from "react";
import { getApplyList, cancelTeamApplication } from "./Auth";
import { testUser, dummyApplyList } from "./dummyData";
import "../Styles/Desktop/MyApplications.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 신청 내역 가져오는 함수
  const fetchApplications = async () => {
    const currentUserId = localStorage.getItem("userId") || "";

    // 웹 테스트 모드: dummyApplyList 사용
    if (currentUserId === testUser.userId) {
      setApplications(dummyApplyList);
      setLoading(false);
      return;
    }

    // 일반 모드: 실제 API 호출
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

  // 신청 취소 핸들러
  const handleCancel = async (teamId) => {
    if (!window.confirm("정말로 이 팀 신청을 취소하시겠습니까?")) return;

    const currentUserId = localStorage.getItem("userId") || "";
    if (currentUserId === testUser.userId) {
      // 웹 테스트 모드
      alert("더미 모드: 신청이 취소되었습니다.");
      setApplications((prev) =>
        prev.map((item) =>
          item.teamId === teamId ? { ...item, status: "REJECT" } : item
        )
      );
      return;
    }

    // 일반 모드
    try {
      const res = await cancelTeamApplication(teamId);
      if (res.success) {
        alert("신청이 취소되었습니다.");
        fetchApplications();
      } else {
        alert(res.message || "취소 실패");
      }
    } catch {
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

  if (loading) return <p className="loading-text">신청 내역을 불러오는 중입니다...</p>;
  if (error)   return <p className="error-text">{error}</p>;

  return (
    <div className="my-applications-container">
      <h2>내 팀 신청 내역</h2>
      {applications.length === 0 ? (
        <p>신청한 팀이 없습니다.</p>
      ) : (
        <ul>
          {applications.map((team) => (
            <li key={team.teamId} className="application-item">
              <div className="application-info">
                <strong>{team.teamName}</strong>
                <p>팀 ID: {team.teamId}</p>
              </div>
              <span className={`status-badge ${team.status.toLowerCase()}`}>
                {getStatusLabel(team.status)}
              </span>
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
