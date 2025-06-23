// Ride.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOtherRideDetail } from "./Auth";
import { testUser, dummyRides } from "./dummyData";
import "../Styles/Desktop/MyRide.css";

const { kakao } = window;

const Ride = () => {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [map, setMap] = useState(null);
  const [showBike, setShowBike] = useState(false);

  // 1) 데이터 페칭
  useEffect(() => {
    const fetchRide = async () => {
      const currentUserId = localStorage.getItem("userId") || "";

      // 웹 테스트 모드: 더미 사용
      if (currentUserId === testUser.userId) {
        const dummy = dummyRides.find(r => r.id === parseInt(rideId, 10));
        if (dummy) {
          const route = dummy.coordinates.map(c => ({
            latitude: c.lat,
            longitude: c.lng,
            warning: c.warning || 0,
          }));
          setRide({ ...dummy, route });
        }
        return;
      }

      // 일반 모드: 실제 API 호출
      try {
        const resp = await getOtherRideDetail(rideId);
        if (resp.success && resp.data?.route) {
          setRide(resp.data);
        } else {
          console.warn("타인 주행 데이터 없음 또는 이상 응답");
        }
      } catch (err) {
        console.error("타인 주행 데이터 불러오기 실패:", err);
        const dummy = dummyRides.find(r => r.id === parseInt(rideId, 10));
        if (dummy) {
          const route = dummy.coordinates.map(c => ({
            latitude: c.lat,
            longitude: c.lng,
            warning: c.warning || 0,
          }));
          setRide({ ...dummy, route });
        }
      }
    };

    fetchRide();
  }, [rideId]);

  // 2) 지도 생성, Polyline + 마커, map 인스턴스 저장
  useEffect(() => {
    if (!ride?.route?.length || !kakao?.maps) return;

    const container = document.getElementById("full-map");
    if (!container) return;

    const kakaoMap = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(
        ride.route[0].latitude,
        ride.route[0].longitude
      ),
      level: 5,
    });

    const linePath = ride.route.map(
      pt => new kakao.maps.LatLng(pt.latitude, pt.longitude)
    );
    new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: "#0F429D",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
    }).setMap(kakaoMap);

    // warning 지점 마커
    ride.route.forEach(pt => {
      if (pt.warning === 1) {
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(pt.latitude, pt.longitude),
          map: kakaoMap,
          title: "⚠ 경고 지점",
        });
        const info = new kakao.maps.InfoWindow({
          content: '<div style="padding:5px;">⚠ 경고 지점</div>',
        });
        kakao.maps.event.addListener(marker, "mouseover", () =>
          info.open(kakaoMap, marker)
        );
        kakao.maps.event.addListener(marker, "mouseout", () =>
          info.close()
        );
      }
    });

    setMap(kakaoMap);
    setShowBike(false);
  }, [ride]);

  // 3) 자전거 도로 토글
  const toggleBicycle = () => {
    if (!map) return;
    if (showBike) {
      map.removeOverlayMapTypeId(kakao.maps.MapTypeId.BICYCLE);
    } else {
      map.addOverlayMapTypeId(kakao.maps.MapTypeId.BICYCLE);
    }
    setShowBike(!showBike);
  };

  if (!ride?.route?.length) {
    return <p className="loading-text">라이딩 정보를 불러오는 중입니다...</p>;
  }

  return (
    <div className="ride-detail-container">
      <h1>기록 ID: {rideId}</h1>
      {ride.startTime && <p><strong>시작 시각:</strong> {ride.startTime}</p>}
      {ride.endTime && <p><strong>종료 시각:</strong> {ride.endTime}</p>}
      <button className="bike-toggle-button" onClick={toggleBicycle}>
        {showBike ? "자전거 도로 숨기기" : "자전거 도로 표시하기"}
      </button>
      <div id="full-map" className="full-map"></div>
    </div>
  );
};

export default Ride;
