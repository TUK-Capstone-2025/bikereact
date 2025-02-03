import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link} from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";import L from "leaflet";
import "./RidePage.css";

const photoIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2991/2991231.png",
  iconSize: [30, 30],
});

const RidePage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {// 추후 API Caller로 대체 예정
    const rideData = {
      101: {
        name: "Morning Ride",
        distance: "12 km",
        duration: "40 min",
        track: [[37.57, 126.98], [37.56, 126.99], [37.55, 126.98]],
        photos: [
          { id: 501, url: "https://via.placeholder.com/100", location: [37.56, 126.99] },
          { id: 502, url: "https://via.placeholder.com/100", location: [37.55, 126.98] },
        ],
      },
    };

    if (rideData[rideId]) {
      setRide(rideData[rideId]);
      setPhotos(rideData[rideId].photos);
    } else {
      navigate("/social"); // 탑승 기록 발견 안될 시 소셜 페이지로 돌아감감
    }
  }, [rideId, navigate]);

  return (
    <div className="ride-page-container">
      {ride ? (
        <>
          <h1>{ride.name}</h1>
          <p><strong>탑승 거리:</strong> {ride.distance}</p>
          <p><strong>탑승 시간:</strong> {ride.duration}</p>

          {/* 자전거 경로 기록 */}
          <MapContainer center={ride.track[0]} zoom={13} className="ride-map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={ride.track} color="blue" />

             {/* 지도 상 사진 아이콘 */}
             {photos.map((photo) => (
              <Marker key={photo.id} position={photo.location} icon={photoIcon}>
                <Popup>
                  <Link to={`/photo/${photo.id}`}>
                    <img src={photo.url} alt="사진 정보" className="photo-thumbnail" />
                    <p>사진 보기</p>
                  </Link>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <button onClick={() => navigate(-1)}>🔙 Back</button>
        </>
      ) : (
        <p>탑승 정보 로딩 중...</p>
      )}
    </div>
  );
};

export default RidePage;
