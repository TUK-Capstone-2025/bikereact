import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRideList } from "./Auth"; // ✅ Auth.js에 정의된 함수
//import "../Styles/Desktop/MyRideList.css";

const MyRideList = () => {
    const [rides, setRides] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const data = await getMyRideList();
                setRides(data);
            } catch (error) {
                console.error("주행 기록을 불러오는 중 오류 발생:", error);
            }
        };

        fetchRides();
    }, []);

    return (
        <div className="my-rides-container">
            <div className="rides-list">
                {rides.length > 0 ? (
                    rides.map((ride) => (
                        <div
                            key={ride.recordId} // ✅ 고유 key
                            className="ride-card"
                            onClick={() => navigate(`/myride/${ride.recordId}`)}
                        >
                            <div className="ride-info">
                                <h2>기록 ID: {ride.recordId}</h2>
                                <p><strong>시작 시간:</strong> {ride.startTime}</p>
                            </div>
                            {/* 지도는 상세 페이지에서만 보여주기로 가정 */}
                        </div>
                    ))
                ) : (
                    <p className="loading-text">기록을 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
};

export default MyRideList;
