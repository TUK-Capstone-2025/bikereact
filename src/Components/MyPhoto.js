import React from "react";
import { useLocation } from "react-router-dom";
import "./MyPhoto.css";
import defaultPhoto from "../icon/logo512.png"; // Import default image

const MyPhoto = () => {
  const location = useLocation();
  const { photo } = location.state || {}; // Get photo details

  if (!photo) {
    return <div>Photo not found!</div>;
  }

  return (
    <div className="photo-detail-container">
      <h1>사진 상세</h1>
      <div className="photo-info">
        <img src={photo.imageUrl || defaultPhoto} alt="Photo" className="photo-img" />
        <p><strong>위치:</strong> {photo.description}</p>
      </div>
    </div>
  );
};

export default MyPhoto;
