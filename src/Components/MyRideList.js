// MyRideList.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRideList, getMyRideDetail } from "./Auth";
import { testUser, dummyRides } from "./dummyData";
import "../Styles/Desktop/MyRideList.css";

const { kakao } = window;

const MyRideList = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // 에러 또는 빈 상태 메시지
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      setMessage("");

      const currentUserId = localStorage.getItem("userId") || "";

      // 웹 테스트 모드 더미 데이터
      if (currentUserId === testUser.userId) {
        const mapped = dummyRides.map((ride) => ({
          recordId: ride.id,
          name: ride.name,
          distance: ride.distance,
          duration: ride.duration,
          route: ride.coordinates.map((c) => ({
            latitude: c.lat,
            longitude: c.lng,
          })),
        }));
        setRides(mapped);
        setLoading(false);
        return;
      }

      try {
        // API 호출: { success, message, data }
        const res = await getMyRideList();

        if (!res.success) {
          setMessage(res.message || "주행 기록이 없습니다.");
          setLoading(false);
          return;
        }

        const list = Array.isArray(res.data) ? res.data : [];
        if (list.length === 0) {
          setMessage("주행 기록이 없습니다.");
          setLoading(false);
          return;
        }

        // 경로 세부 정보 가져오기
        const ridesWithRoute = await Promise.all(
          list.map(async (ride) => {
            try {
              const detail = await getMyRideDetail(ride.recordId);
              if (detail.success && detail.data?.route) {
                return { ...ride, route: detail.data.route };
              }
            } catch {
              // ignore
            }
            return { ...ride, route: [] };
          })
        );

        setRides(ridesWithRoute);
      } catch (error) {
        console.error("주행 기록 조회 중 오류:", error);
        setMessage("주행 기록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  // 카카오맵 렌더링
  useEffect(() => {
    rides.forEach((ride) => {
      if (!ride.route?.length) return;
      const container = document.getElementById(`map-${ride.recordId}`);
      if (!container || !kakao?.maps) return;

      const map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(
          ride.route[0].latitude,
          ride.route[0].longitude
        ),
        level: 7,
      });

      const path = ride.route.map(
        (p) => new kakao.maps.LatLng(p.latitude, p.longitude)
      );
      new kakao.maps.Polyline({
        path,
        strokeWeight: 3,
        strokeColor: "#0F429D",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      }).setMap(map);
    });
  }, [rides]);

  if (loading) {
    return <p className="loading-text">기록을 불러오는 중입니다...</p>;
  }

  if (message) {
    return <p className="loading-text">{message}</p>;
  }

  return (
    <div className="my-rides-container">
      <div className="rides-list">
        {rides.map((ride) => (
          <div
            key={ride.recordId}
            className="ride-card"
            onClick={() => navigate(`/myride/${ride.recordId}`)}
          >
            <div
              id={`map-${ride.recordId}`}
              className="ride-thumbnail-map"
            ></div>
            <div className="ride-info">
              <h2>{ride.name}</h2>
              <p>
                <strong>거리:</strong> {ride.distance} /{" "}
                <strong>시간:</strong> {ride.duration}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRideList;
