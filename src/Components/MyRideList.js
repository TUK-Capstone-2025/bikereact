// src/components/MyRideList.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRideList, getMyRideDetail } from "./Auth";
import { testUser, dummyRides } from "./dummyData";
import "../Styles/Desktop/MyRideList.css";

// 날짜 파서 (MyRide와 동일)
function parseCustomDate(s) {
  const [ymd, hms] = s.split(" ");
  const [yy, mm, dd] = ymd.split(".").map(Number);
  const [HH, MM, SS] = hms.split(":").map(Number);
  return new Date(2000 + yy, mm - 1, dd, HH, MM, SS);
}

// 시간 포맷
function formatDuration(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

export default function MyRideList() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMessage("");
      const uid = localStorage.getItem("userId") || "";
      if (uid === testUser.userId) {
        setRides(
          dummyRides.map((r) => ({
            recordId: r.id,
            startTime: r.startTime,
            endTime: r.endTime,
            distance: r.distance,
            route: r.coordinates.map((c) => ({
              latitude: c.lat,
              longitude: c.lng,
            })),
          }))
        );
        setLoading(false);
        return;
      }
      try {
        const res = await getMyRideList();
        if (!res.success) {
          setMessage(res.message);
        } else if ((res.data || []).length === 0) {
          setMessage("주행 기록이 없습니다.");
        } else {
          const full = await Promise.all(
            res.data.map(async (r) => {
              const entry = {
                recordId: r.recordId,
                startTime: r.startTime,
                endTime: r.endTime,
                distance: r.distance,
                route: [],
              };
              try {
                const d = await getMyRideDetail(r.recordId);
                if (d.success && d.data.route) entry.route = d.data.route;
              } catch {}
              return entry;
            })
          );
          setRides(full);
        }
      } catch {
        setMessage("불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 썸네일 맵 그리기 (경로+줌 자동)
  useEffect(() => {
    rides.forEach((r) => {
      if (!r.route.length) return;
      const container = document.getElementById(`thumb-${r.recordId}`);
      if (!container || !window.kakao?.maps) return;

      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(
          r.route[0].latitude,
          r.route[0].longitude
        ),
        level: 7, // 초기 레벨
      });

      // 폴리라인
      const path = r.route.map(
        (p) => new window.kakao.maps.LatLng(p.latitude, p.longitude)
      );
      new window.kakao.maps.Polyline({
        path,
        strokeWeight: 3,
        strokeColor: "#0F429D",
        strokeOpacity: 0.8,
      }).setMap(map);

      // Bounds 계산 & 세팅
      const bounds = new window.kakao.maps.LatLngBounds();
      path.forEach((latlng) => bounds.extend(latlng));
      map.setBounds(bounds);
    });
  }, [rides]);

  if (loading) return <p className="my-ride-list__loading">불러오는 중…</p>;
  if (message) return <p className="my-ride-list__loading">{message}</p>;

  return (
    <div className="my-ride-list">
      {rides.map((r) => {
        // 주행 시간 계산
        let durationText = "";
        if (r.startTime && r.endTime) {
          const diff = parseCustomDate(r.endTime) - parseCustomDate(r.startTime);
          durationText = formatDuration(diff);
        }
        return (
          <div
            key={r.recordId}
            className="my-ride-list__card"
            onClick={() => navigate(`/myride/${r.recordId}`)}
          >
            <div
              id={`thumb-${r.recordId}`}
              className="my-ride-list__thumb"
            />
            <div className="my-ride-list__details">
              <p>
                <strong>Record #{r.recordId}</strong>
              </p>
              {r.startTime && <p>시작: {r.startTime}</p>}
              {r.endTime && <p>종료: {r.endTime}</p>}
              {durationText && <p>시간: {durationText}</p>}
              <p>거리: {r.distance} km</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
