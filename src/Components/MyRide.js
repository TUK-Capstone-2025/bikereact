// src/components/MyRide.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMyRideDetail, getMyPage } from "./Auth";
import { testUser, dummyRides } from "./dummyData";
import "../Styles/Desktop/MyRide.css";

const { kakao } = window;

// "25.05.01 18:22:35" 같은 포맷을 JS Date로 변환
function parseCustomDate(s) {
  const [ymd, hms] = s.split(" ");
  const [yy, mm, dd] = ymd.split(".").map(Number);
  const [HH, MM, SS] = hms.split(":").map(Number);
  return new Date(2000 + yy, mm - 1, dd, HH, MM, SS);
}

// Haversine 공식: 두 점 사이 거리(미터)
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = v => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export default function MyRide() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [showBike, setShowBike] = useState(false);

  // 로그인 유저 정보 조회
  useEffect(() => {
    const loadUser = async () => {
      const uid = localStorage.getItem("userId") || "";
      if (uid === testUser.userId) {
        setUser(testUser);
      } else {
        try {
          const res = await getMyPage();
          if (res.success) setUser(res.data);
        } catch {}
      }
    };
    loadUser();
  }, []);

  // 라이딩 상세 조회
  useEffect(() => {
    const fetchRide = async () => {
      setLoading(true);
      const uid = localStorage.getItem("userId") || "";
      if (uid === testUser.userId) {
        const dummy = dummyRides.find(r => r.id === +rideId);
        if (dummy) {
          setRide({
            ...dummy,
            route: dummy.coordinates.map(c => ({
              latitude: c.lat,
              longitude: c.lng
            }))
          });
        }
        setLoading(false);
        return;
      }
      try {
        const res = await getMyRideDetail(rideId);
        if (res.success && res.data.route) setRide(res.data);
      } catch {}
      setLoading(false);
    };
    fetchRide();
  }, [rideId]);

  // 지도 렌더링 + bounds
  useEffect(() => {
    if (!ride?.route?.length || !kakao?.maps) return;
    const container = document.getElementById("my-ride-full-map");
    const kakaoMap = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(
        ride.route[0].latitude,
        ride.route[0].longitude
      ),
      level: 5
    });

    // 경로 폴리라인만 표시
    const path = ride.route.map(
      p => new kakao.maps.LatLng(p.latitude, p.longitude)
    );
    new kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: "#0F429D",
      strokeOpacity: 0.9
    }).setMap(kakaoMap);

    // 전체 경로에 맞춰 bounds 설정
    const bounds = new kakao.maps.LatLngBounds();
    path.forEach(latlng => bounds.extend(latlng));
    kakaoMap.setBounds(bounds);

    setMap(kakaoMap);
  }, [ride]);

  // Navbar 토글 이벤트 처리
  useEffect(() => {
    const handler = () => {
      if (!map || !kakao?.maps) return;
      const K = kakao.maps.MapTypeId.BICYCLE;
      if (showBike) map.removeOverlayMapTypeId(K);
      else map.addOverlayMapTypeId(K);
      setShowBike(!showBike);
    };
    window.addEventListener("toggleBicycleOverlay", handler);
    return () => window.removeEventListener("toggleBicycleOverlay", handler);
  }, [map, showBike]);

  if (loading) {
    return <p className="my-ride-loading-text">라이딩 정보를 불러오는 중입니다...</p>;
  }
  if (!ride?.route?.length) {
    return <p className="my-ride-loading-text">표시할 라이딩 정보가 없습니다.</p>;
  }

  // 주행 시간 계산
  let durationText = "";
  if (ride.startTime && ride.endTime) {
    const diff = parseCustomDate(ride.endTime) - parseCustomDate(ride.startTime);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    durationText = `${h}시간 ${m}분 ${s}초`;
  }

  // 총 거리 계산 (km)
  const totalMeters = ride.route.reduce((sum, cur, i, arr) => {
    if (i === 0) return 0;
    const prev = arr[i - 1];
    return sum + haversine(prev.latitude, prev.longitude, cur.latitude, cur.longitude);
  }, 0);
  const distanceKm = (totalMeters / 1000).toFixed(2);

  return (
    <div className="my-ride-detail-container">
      <div id="my-ride-full-map" className="my-ride-full-map" />
      <div className="my-ride-info">
        {user && (
          <div className="my-ride-user">
            <img
              src={user.profileImageUrl || "/default_profilePic.svg"}
              alt="프로필"
              className="my-ride-user-avatar"
            />
            <span className="my-ride-user-nickname">{user.nickname}</span>
          </div>
        )}
        <h1>Record ID: {rideId}</h1>
        {ride.startTime && <p>시작: {ride.startTime}</p>}
        {ride.endTime && <p>종료: {ride.endTime}</p>}
        {durationText && <p>주행 시간: {durationText}</p>}
        <p>총 거리: {distanceKm} km</p>
      </div>
    </div>
  );
}
