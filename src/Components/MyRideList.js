import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRideList, getMyRideDetail } from "./Auth"; // ✅ getMyRideDetail도 필요
import "../Styles/Desktop/MyRideList.css";

const { kakao } = window;

const MyRideList = () => {
    const [rides, setRides] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const list = await getMyRideList();

                // 각 recordId에 대한 상세 경로 호출
                const ridesWithRoute = await Promise.all(
                    list.map(async (ride) => {
                        try {
                            const detail = await getMyRideDetail(ride.recordId);
                            if (detail.success && detail.data?.route) {
                                return { ...ride, route: detail.data.route };
                            }
                        } catch (e) {}
                        return { ...ride, route: [] }; // 실패 시 빈 경로
                    })
                );

                setRides(ridesWithRoute);
            } catch (error) {
                console.error("주행 기록을 불러오는 중 오류 발생:", error);
            }
        };

        fetchRides();
    }, []);

    useEffect(() => {
        // 지도 렌더링
        rides.forEach((ride) => {
            if (!ride.route || ride.route.length === 0) return;

            const container = document.getElementById(`map-${ride.recordId}`);
            if (!container || !kakao || !kakao.maps) return;

            const map = new kakao.maps.Map(container, {
                center: new kakao.maps.LatLng(ride.route[0].latitude, ride.route[0].longitude),
                level: 7,
            });

            const path = ride.route.map(
                (p) => new kakao.maps.LatLng(p.latitude, p.longitude)
            );

            const polyline = new kakao.maps.Polyline({
                path,
                strokeWeight: 3,
                strokeColor: "#0F429D",
                strokeOpacity: 0.8,
                strokeStyle: "solid",
            });

            polyline.setMap(map);
        });
    }, [rides]);

    return (
        <div className="my-rides-container">
            <div className="rides-list">
                {rides.length > 0 ? (
                    rides.map((ride) => (
                        <div
                            key={ride.recordId}
                            className="ride-card"
                            onClick={() => navigate(`/myride/${ride.recordId}`)}
                        >
                            <div className="ride-info">
                                <h2>기록 ID: {ride.recordId}</h2>
                                <p><strong>시작 시간:</strong> {ride.startTime}</p>
                            </div>
                            <div
                                id={`map-${ride.recordId}`}
                                className="ride-thumbnail-map"
                            ></div>
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
