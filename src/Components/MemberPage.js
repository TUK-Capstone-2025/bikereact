// src/components/MemberPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getMemberProfile,
  getMemberRideList,
  getOtherRideDetail,
} from "./Auth";
import "../Styles/Desktop/MemberPage.css";

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

export default function MemberPage() {
  const { memberId } = useParams();
  const [profile, setProfile] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pr, rl] = await Promise.all([
          getMemberProfile(memberId),
          getMemberRideList(memberId),
        ]);
        if (!pr.success) throw new Error("프로필 정보를 불러올 수 없습니다.");
        if (!rl.success) throw new Error("주행 기록 정보를 불러올 수 없습니다.");
        setProfile(pr.data);

        const detailed = await Promise.all(
          rl.data.map(async ride => {
            let route = [];
            let startTime = ride.startTime;
            let endTime = ride.endTime;
            try {
              const det = await getOtherRideDetail(ride.recordId);
              if (det.success && det.data) {
                route = det.data.route || [];
                startTime = det.data.startTime || startTime;
                endTime   = det.data.endTime   || endTime;
              }
            } catch {}
            return { ...ride, route, startTime, endTime };
          })
        );
        setRides(detailed);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [memberId]);

  useEffect(() => {
    rides.forEach(ride => {
      if (!ride.route.length) return;
      const el = document.getElementById(`map-member-ride-${ride.recordId}`);
      if (!el || !kakao?.maps) return;
      const map = new kakao.maps.Map(el, {
        center: new kakao.maps.LatLng(
          ride.route[0].latitude,
          ride.route[0].longitude
        ),
        level: 7,
      });

      const path = ride.route.map(
        p => new kakao.maps.LatLng(p.latitude, p.longitude)
      );
      new kakao.maps.Polyline({
        path,
        strokeWeight: 3,
        strokeColor: "#0F429D",
        strokeOpacity: 0.8,
      }).setMap(map);

      // ── 여기 추가: LatLngBounds 로 전체 경로에 딱 맞춰 줌 조정 ──
      const bounds = new kakao.maps.LatLngBounds();
      path.forEach(latlng => bounds.extend(latlng));
      map.setBounds(bounds);
    });
  }, [rides]);

  if (loading) return <p className="mp-loading">로딩 중...</p>;
  if (error)   return <p className="mp-error">{error}</p>;

  return (
    <div className="member-page-container">
      <div className="profile-section">
        <img
          src={profile.profileImageUrl || "/default_profilePic.svg"}
          alt={`${profile.nickname} 프로필`}
          className="profile-image"
          onError={e => { e.currentTarget.src = "/default_profilePic.svg"; }}
        />
        <h2 className="profile-nickname">{profile.nickname} 님</h2>
      </div>

      <div className="rides-section">
        <h3>주행 기록</h3>
        {rides.length === 0 ? (
          <p className="no-rides">등록된 주행 기록이 없습니다.</p>
        ) : (
          <ul className="rides-list">
            {rides.map(ride => {
              let duration = "";
              if (ride.startTime && ride.endTime) {
                const diff = parseCustomDate(ride.endTime) - parseCustomDate(ride.startTime);
                const h = Math.floor(diff/3600000);
                const m = Math.floor((diff%3600000)/60000);
                const s = Math.floor((diff%60000)/1000);
                duration = `${h}시간 ${m}분 ${s}초`;
              }
              let distanceKm = ride.distance;
              if (!distanceKm && ride.route.length) {
                const meters = ride.route.reduce((sum, p, i, arr) => {
                  if (i===0) return 0;
                  const prev = arr[i-1];
                  return sum + haversine(prev.latitude, prev.longitude, p.latitude, p.longitude);
                },0);
                distanceKm = (meters/1000).toFixed(2);
              }
              return (
                <li key={ride.recordId} className="ride-item">
                  <div
                    id={`map-member-ride-${ride.recordId}`}
                    className="ride-thumb"
                  />
                  <div className="ride-info">
                    <p><strong>Record ID:</strong> {ride.recordId}</p>
                    {ride.startTime && <p><strong>시작:</strong> {ride.startTime}</p>}
                    {ride.endTime   && <p><strong>종료:</strong> {ride.endTime}</p>}
                    {duration       && <p><strong>주행 시간:</strong> {duration}</p>}
                    {distanceKm     && <p><strong>거리:</strong> {distanceKm} km</p>}
                    <Link to={`/ride/${ride.recordId}`}>
                      <button className="view-route">경로 보기</button>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
