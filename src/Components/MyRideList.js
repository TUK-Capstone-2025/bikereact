import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyRideList.css";

const MyRideList = () => {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = () => {
      const fetchedRides = [
        {
          id: 1,
          name: "아침 라이딩",
          distance: "12 km",
          duration: "40분",
          coordinates: [
            { lat: 37.5665, lng: 126.978 }, // 서울시청
            { lat: 37.5705, lng: 126.982 }, // 광화문
            { lat: 37.5745, lng: 126.986 }, // 경복궁
          ],
        },
        {
          id: 2,
          name: "오후 라이딩",
          distance: "15 km",
          duration: "50분",
          coordinates: [
            { lat: 37.541, lng: 127.056 }, // 잠실
            { lat: 37.550, lng: 127.074 }, // 올림픽공원
            { lat: 37.564, lng: 127.098 }, // 천호동
          ],
        },
        {
          id: 3,
          name: "저녁 라이딩",
          distance: "10 km",
          duration: "30분",
          coordinates: [
            { lat: 37.498, lng: 127.027 }, // 강남역
            { lat: 37.505, lng: 127.036 }, // 압구정
            { lat: 37.513, lng: 127.048 }, // 청담동
          ],
        },
      ];
      setRides(fetchedRides);
    };

    fetchRides();
  }, []);

  return (
    <div className="my-rides-container">
      <div className="rides-list">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="ride-item"
            onClick={() => navigate(`/myride/${ride.id}`, { state: { coordinates: ride.coordinates } })}
          >
            <h2>{ride.name}</h2>
            <p>
              <strong>거리:</strong> {ride.distance}
            </p>
            <p>
              <strong>시간:</strong> {ride.duration}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRideList;
