import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyRides } from "./dummyData";
import "../Styles/Desktop/MyRideList.css";

const MyRideList = () => {
    const [rides, setRides] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setRides(dummyRides);

        // Ensure Kakao Maps API is available
        if (window.kakao && window.kakao.maps) {
            dummyRides.forEach((ride) => {
                setTimeout(() => {
                    const container = document.getElementById(`map-${ride.id}`);
                    if (container && ride.coordinates.length > 0) {
                        const options = {
                            center: new window.kakao.maps.LatLng(ride.coordinates[0].lat, ride.coordinates[0].lng),
                            level: 5,
                        };
                        const map = new window.kakao.maps.Map(container, options);

                        // Draw the ride path
                        const linePath = ride.coordinates.map(coord => new window.kakao.maps.LatLng(coord.lat, coord.lng));
                        const polyline = new window.kakao.maps.Polyline({
                            path: linePath,
                            strokeWeight: 3,
                            strokeColor: "#0F429D",
                            strokeOpacity: 0.9,
                            strokeStyle: "solid",
                        });
                        polyline.setMap(map);
                    }
                }, 500);
            });
        }
    }, []);

    return (
        <div className="my-rides-container">
            <div className="rides-list">
                {rides.length > 0 ? (
                    rides.map((ride) => (
                        <div
                            key={ride.id}
                            className="ride-card"
                            onClick={() => navigate(`/myride/${ride.id}`, { state: { coordinates: ride.coordinates } })}
                        >
                            <div className="ride-info">
                                <h2>{ride.name}</h2>
                                <p><strong>거리:</strong> {ride.distance}</p>
                                <p><strong>시간:</strong> {ride.duration}</p>
                            </div>
                            <div id={`map-${ride.id}`} className="ride-thumbnail"></div> {/* Mini Map */}
                        </div>
                    ))
                ) : (
                    <p className="loading-text">Loading rides...</p>
                )}
            </div>
        </div>
    );
};

export default MyRideList;
