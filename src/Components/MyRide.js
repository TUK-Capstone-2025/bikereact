import React, { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./MyRide.css";
import defaultPhoto from "../icon/logo512.png"; // Import default image

const { kakao } = window;

const MyRide = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const coordinates = location.state?.coordinates || [];

  // Dummy data for photos along the ride
  const photos = [
    {
      id: 1,
      lat: 37.5665,
      lng: 126.978,
      imageUrl: null, // No uploaded photo (uses default)
      description: "서울시청",
    },
    {
      id: 2,
      lat: 37.5705,
      lng: 126.982,
      imageUrl: "https://via.placeholder.com/150",
      description: "광화문",
    },
    {
      id: 3,
      lat: 37.5745,
      lng: 126.986,
      imageUrl: null, // No uploaded photo (uses default)
      description: "경복궁",
    },
  ];

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: coordinates.length
        ? new kakao.maps.LatLng(coordinates[0].lat, coordinates[0].lng)
        : new kakao.maps.LatLng(37.5665, 126.978),
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

      // Place photo markers along the path
      photos.forEach((photo) => {
        const markerPosition = new kakao.maps.LatLng(photo.lat, photo.lng);
        
        // Create custom overlay for photo marker
        const content = document.createElement("div");
        content.className = "photo-overlay";
        content.innerHTML = `<img src="${photo.imageUrl || defaultPhoto}" class="photo-marker" alt="Photo">`;
        content.onclick = () => navigate(`/myphoto/${photo.id}`, { state: { photo } });

        const overlay = new kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          yAnchor: 1.2, // Moves the image slightly above the actual marker point
        });

        overlay.setMap(map);
      });
    }
  }, [coordinates, photos, navigate]);

  return (
    <div className="ride-detail-container">
      <div id="map"></div>
    </div>
  );
};

export default MyRide;
