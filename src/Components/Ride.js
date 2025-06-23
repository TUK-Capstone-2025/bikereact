// src/components/Ride.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOtherRideDetail } from "./Auth";
import { testUser, dummyRides } from "./dummyData";
import "../Styles/Desktop/Ride.css";  // <-- 다른 prefix 를 쓰는 전용 CSS

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

export default function Ride() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);

  // 데이터 페칭
  useEffect(() => {
    async function fetchRide() {
      setLoading(true);
      const uid = localStorage.getItem("userId") || "";
      let data = null;

      if (uid === testUser.userId) {
        data = dummyRides.find(r => r.id === +rideId);
      } else {
        try {
          const resp = await getOtherRideDetail(rideId);
          if (resp.success) data = resp.data;
        } catch {}
      }

      if (data) {
        const route = (data.route || data.coordinates || []).map(c => ({
          latitude: c.lat ?? c.latitude,
          longitude: c.lng ?? c.longitude,
        }));
        setRide({
          ...data,
          route,
          startTime: data.startTime,
          endTime: data.endTime,
        });
      }

      setLoading(false);
    }
    fetchRide();
  }, [rideId]);

  // 지도 생성 & bounds
  useEffect(() => {
    if (!ride?.route?.length || !kakao?.maps) return;
    const container = document.getElementById("other-ride-full-map");
    if (!container) return;

    const kakaoMap = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(
        ride.route[0].latitude,
        ride.route[0].longitude
      ),
      level: 5,
    });

    const path = ride.route.map(
      p => new kakao.maps.LatLng(p.latitude, p.longitude)
    );
    new kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: "#0F429D",
      strokeOpacity: 0.9,
    }).setMap(kakaoMap);

    const bounds = new kakao.maps.LatLngBounds();
    path.forEach(latlng => bounds.extend(latlng));
    kakaoMap.setBounds(bounds);

    setMap(kakaoMap);
  }, [ride]);

  if (loading) {
    return <p className="other-ride-loading-text">라이딩 정보를 불러오는 중입니다...</p>;
  }
  if (!ride) {
    return <p className="other-ride-loading-text">표시할 라이딩 정보가 없습니다.</p>;
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
    <div className="other-ride-detail-container">
      <div className="other-ride-info">
        <h1>Record ID: {rideId}</h1>
        {ride.startTime && <p>시작: {ride.startTime}</p>}
        {ride.endTime && <p>종료: {ride.endTime}</p>}
        {durationText && <p>주행 시간: {durationText}</p>}
        <p>총 거리: {distanceKm} km</p>
      </div>

      <div id="other-ride-full-map" className="other-ride-full-map" />
    </div>
  );
}
