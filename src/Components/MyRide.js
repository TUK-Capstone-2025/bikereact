import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMyRideDetail } from "./Auth";
import { dummyRides } from "./dummyData"; // 더미 데이터 import
import "../Styles/Desktop/MyRide.css";

const { kakao } = window;

const MyRide = () => {
    const { rideId } = useParams();
    const [ride, setRide] = useState(null);

    useEffect(() => {
        const fetchRide = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                if (!token) {
                    console.warn("토큰 없음: 더미 데이터 표시");
                    const dummyRide = dummyRides.find((ride) => ride.id === parseInt(rideId));
                    setRide(dummyRide);
                    return;
                }

                const response = await getMyRideDetail(rideId);
                console.log("서버 응답:", response);
                console.log("response 객체:", response);
                console.log("response.data.route:", response?.data?.route);

                if (response.success && response.data?.route) {
                    setRide(response.data);
                } else {
                    console.warn("서버 응답 형식 이상 또는 데이터 없음");
                }
            } catch (error) {
                console.error("주행 데이터 불러오기 실패:", error);
                const dummyRide = dummyRides.find((ride) => ride.id === parseInt(rideId));
                setRide(dummyRide);
            }
        };

        fetchRide();
    }, [rideId]);

    useEffect(() => {
        if (!ride || !ride.route || ride.route.length === 0) {
            console.log("지도 렌더링 스킵 - 데이터 없음");
            return;
        }

        if (!kakao || !kakao.maps) {
            console.error("카카오 지도 API가 로드되지 않았습니다.");
            return;
        }

        const container = document.getElementById("full-map");
        if (!container) {
            console.error("지도 container (#full-map)를 찾을 수 없습니다.");
            return;
        }

        const map = new kakao.maps.Map(container, {
            center: new kakao.maps.LatLng(
                ride.route[0].latitude,
                ride.route[0].longitude
            ),
            level: 5,
        });

        const linePath = ride.route.map(
            (point) => new kakao.maps.LatLng(point.latitude, point.longitude)
        );

        const polyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: "#0F429D",
            strokeOpacity: 0.9,
            strokeStyle: "solid",
        });

        polyline.setMap(map);

    }, [ride]);

    if (!ride || !ride.route || ride.route.length === 0) {
        return <p className="loading-text">라이딩 정보를 불러오는 중입니다...</p>;
    }

    return (
        <div className="ride-detail-container">     
            <div id="full-map" className="full-map"></div>
        </div>
    );
};

export default MyRide;
