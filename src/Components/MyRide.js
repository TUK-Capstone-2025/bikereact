// MyRide.js
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getMyRideDetail } from "./Auth";
import { testUser, dummyRides } from "./dummyData";
import "../Styles/Desktop/MyRide.css";

const { kakao } = window;

const MyRide = () => {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [map, setMap] = useState(null);
  const [showBike, setShowBike] = useState(false);

  // 오버레이 토글 함수 (변경 없이 재사용)
  const toggleBicycle = useCallback(() => {
    if (!map) return;
    if (showBike) {
      map.removeOverlayMapTypeId(kakao.maps.MapTypeId.BICYCLE);
    } else {
      map.addOverlayMapTypeId(kakao.maps.MapTypeId.BICYCLE);
    }
    setShowBike((prev) => !prev);
  }, [map, showBike]);

  // 1) 데이터 페칭
  useEffect(() => {
    const fetchRide = async () => {
      const currentUserId = localStorage.getItem("userId") || "";

      if (currentUserId === testUser.userId) {
        const dummy = dummyRides.find((r) => r.id === parseInt(rideId, 10));
        if (dummy) {
          const route = dummy.coordinates.map((c) => ({
            latitude: c.lat,
            longitude: c.lng,
          }));
          setRide({ ...dummy, route });
        }
        return;
      }

      try {
        const resp = await getMyRideDetail(rideId);
        if (resp.success && resp.data?.route) {
          setRide(resp.data);
        }
      } catch {
        // 실패 시 더미 사용
        const dummy = dummyRides.find((r) => r.id === parseInt(rideId, 10));
        if (dummy) {
          const route = dummy.coordinates.map((c) => ({
            latitude: c.lat,
            longitude: c.lng,
          }));
          setRide({ ...dummy, route });
        }
      }
    };

    fetchRide();
  }, [rideId]);

  // 2) 지도 초기화
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

    const path = ride.route.map(
      (pt) => new kakao.maps.LatLng(pt.latitude, pt.longitude)
    );
    new kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: "#0F429D",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
    }).setMap(kakaoMap);

    setMap(kakaoMap);
    setShowBike(false);
  }, [ride]);

  // 3) Navbar에서 발생시킨 이벤트 리스닝
  useEffect(() => {
    window.addEventListener("toggleBicycleOverlay", toggleBicycle);
    return () => window.removeEventListener("toggleBicycleOverlay", toggleBicycle);
  }, [toggleBicycle]);

  if (!ride?.route?.length) {
    return <p className="loading-text">라이딩 정보를 불러오는 중입니다...</p>;
  }

  return (
    <div className="ride-detail-container">
      {/* (로컬 토글 버튼 제거) */}
      <div id="full-map" className="full-map"></div>
    </div>
  );
};

export default MyRide;
