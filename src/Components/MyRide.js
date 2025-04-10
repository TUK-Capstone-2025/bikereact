import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { dummyRides } from "./dummyData";
import "../Styles/Desktop/MyRide.css";

const { kakao } = window;

const MyRide = () => {
    const { rideId } = useParams();
    const ride = dummyRides.find((r) => r.id === Number(rideId)) || {};

    useEffect(() => {
        if (!ride.coordinates) return;

        const container = document.getElementById("full-map");
        if (!container) return;

        const options = {
            center: new kakao.maps.LatLng(ride.coordinates[0].lat, ride.coordinates[0].lng),
            level: 5,
        };
        const map = new kakao.maps.Map(container, options);

        const linePath = ride.coordinates.map(coord => new kakao.maps.LatLng(coord.lat, coord.lng));
        const polyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: "#0F429D",
            strokeOpacity: 0.9,
            strokeStyle: "solid",
        });
        polyline.setMap(map);

    }, [ride]);

    return (
        <div className="ride-detail-container">
            <h1>{ride.name}</h1>
            <p><strong>거리:</strong> {ride.distance}</p>
            <p><strong>시간:</strong> {ride.duration}</p>
            <div id="full-map" className="full-map"></div> {/* Full Map */}
        </div>
    );
};

export default MyRide;
