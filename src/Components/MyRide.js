import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./MyRide.css";

const { kakao } = window;

const MyRide = () => {
  const { rideId } = useParams();
  const location = useLocation();
  const coordinates = location.state?.coordinates || [];

  // Dummy data for ride details (you can replace it with real data)
  const rideDetails = {
    name: "아침 라이딩", // Example name
    distance: "12 km",  // Example distance
    duration: "40분",   // Example duration
  };

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: coordinates.length
        ? new kakao.maps.LatLng(coordinates[0].lat, coordinates[0].lng)
        : new kakao.maps.LatLng(37.5665, 126.978), // Default to Seoul City Hall
      level: 5,
    };
    const map = new kakao.maps.Map(container, options);

    if (coordinates.length) {
      const linePath = coordinates.map((coord) => new kakao.maps.LatLng(coord.lat, coord.lng));
      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#0F429D",
        strokeOpacity: 0.9,
        strokeStyle: "solid",
      });
      polyline.setMap(map);
    }
  }, [coordinates]);

  return (
    <div className="ride-detail-container">
      {/* Detailed Information */}
      <div className="ride-info">
        <p><strong>라이딩 이름:</strong> {rideDetails.name}</p>
        <p><strong>거리:</strong> {rideDetails.distance}</p>
        <p><strong>시간:</strong> {rideDetails.duration}</p>
      </div>

      <div id="map"></div>
    </div>
  );
};

export default MyRide;
