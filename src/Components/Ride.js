import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOtherRideDetail } from "./Auth";
import { dummyRides } from "./dummyData";
import "../Styles/Desktop/MyRide.css"; // 동일 스타일 재사용

const { kakao } = window;

const Ride = () => {
    const { rideId } = useParams();
    const [ride, setRide] = useState(null);

    useEffect(() => {
        const fetchRide = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                if (!token) {
                    console.warn("토큰 없음: 더미 데이터 사용");
                    const dummyRide = dummyRides.find((ride) => ride.id === parseInt(rideId));
                    setRide(dummyRide);
                    return;
                }

                const response = await getOtherRideDetail(rideId);
                console.log("타인 기록 응답:", response);

                if (response.success && response.data?.route) {
                    setRide(response.data);
                } else {
                    console.warn("타인 주행 데이터 없음 또는 이상한 응답 형식");
                }
            } catch (error) {
                console.error("타인 주행 데이터 불러오기 실패:", error);
                const dummyRide = dummyRides.find((ride) => ride.id === parseInt(rideId));
                setRide(dummyRide);
            }
        };

        fetchRide();
    }, [rideId]);

    useEffect(() => {
        if (!ride || !ride.route || ride.route.length === 0) return;
        if (!kakao || !kakao.maps) {
            console.error("카카오 지도 API가 로드되지 않았습니다.");
            return;
        }

        const container = document.getElementById("full-map");
        if (!container) return;

        const map = new kakao.maps.Map(container, {
            center: new kakao.maps.LatLng(ride.route[0].latitude, ride.route[0].longitude),
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

        ride.route.forEach((point) => {
            if (point.warning === 1) {
                const marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(point.latitude, point.longitude),
                    map: map,
                    title: "경고 지점",
                });

                const infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="padding:5px;">⚠ 경고 지점</div>',
                });

                kakao.maps.event.addListener(marker, "mouseover", () => infowindow.open(map, marker));
                kakao.maps.event.addListener(marker, "mouseout", () => infowindow.close());
            }
        });
    }, [ride]);

    if (!ride || !ride.route || ride.route.length === 0) {
        return <p className="loading-text">라이딩 정보를 불러오는 중입니다...</p>;
    }

    return (
        <div className="ride-detail-container">
            <h1>기록 ID: {rideId}</h1>
            <p><strong>시작 시각:</strong> {ride.startTime}</p>
            <p><strong>종료 시각:</strong> {ride.endTime}</p>
            <div id="full-map" className="full-map"></div>
        </div>
    );
};

export default Ride;
