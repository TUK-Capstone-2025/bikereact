import Social from "./Social";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import L from "leaflet";
import "leaflet/dist/leaflet.css"
import "./MainPage.css";

const MainPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const mapRef = useRef(null); // 맵 인스턴스 저장
  const [userLocation, setUserLocation] = useState(null);
  const [isGpsActive, setIsGpsActive] = useState(false); // GPS 활성화 여부 체크

  // 기본 GPS 위치인 서울시청의 위도 및 경도
  const defaultLocation = [37.5665, 126.9780];

  useEffect(() => {
    if (mapRef.current) return; // 맵이 이미 존재하면 재이니셜라이징 하지 않음

    // 맵은 한 번만 이니셜라이징 함
    const mapInstance = L.map("leaflet-map", {
      dragging: false, 
      touchZoom: false, 
      scrollWheelZoom: false,
      doubleClickZoom: false, 
    }).setView(defaultLocation, 13);

    // 타일 레이어 추가가 (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapInstance);

    mapRef.current = mapInstance; // ref에 맵 인스턴스 추가
  }, []);

  const startGPS = () => { //GPS추적 시작
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);

          // 유저의 위치로 맵 업데이트
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
            L.marker([latitude, longitude]).addTo(mapRef.current)
              .bindPopup("<b>You are here</b>")
              .openPopup();
            setIsGpsActive(true); // GPS 활성화
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // GPS 활성화되면 맵 조작 활성화
  useEffect(() => {
    if (mapRef.current && isGpsActive) {
      mapRef.current.dragging.enable();
      mapRef.current.touchZoom.enable();
      mapRef.current.scrollWheelZoom.enable();
      mapRef.current.doubleClickZoom.enable();
    }
  }, [isGpsActive]);

  return (
    <div className="main-container">
      {/* 앱 타이틀 부분 */}
      <header className="app-header">
        <h1>메인 페이지</h1>
      </header>

      {/* 주행 시작 버튼 */}
      {!isGpsActive && (
        <div className="gps-button-container">
          <button className="gps-button" onClick={startGPS}>
            주행 시작
          </button>
        </div>
      )}

      {/* Leaflet 지도 */}
      <div id="leaflet-map" className="map-background"></div>

      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <button onClick={() => navigate("Social")}>👫 소셜</button>
        <button onClick={() => console.log("Settings")}>⚙️ 설정</button>
        <button onClick={() => console.log("My Page")}>👤 마이페이지</button>
      </div>

      {/* Logout Button */}
      <button className="logout-button" onClick={onLogout}>로그아웃</button>
    </div>
  );
};

export default MainPage;
