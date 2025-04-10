import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/Desktop/PhotoPage.css";

const PhotoPage = () => {
  const { photoId } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    // 추후 API Call로 대체 예정정
    const photoData = {
      501: { url: "https://via.placeholder.com/500", description: "Beautiful sunrise on the trail.", likes: 5 },
      502: { url: "https://via.placeholder.com/500", description: "Stopped for a coffee break.", likes: 8 },
    };

    if (photoData[photoId]) {
      setPhoto(photoData[photoId]);
      setLikes(photoData[photoId].likes);
      setComments([
        { id: 1, text: "잘 찍었네" },
        { id: 2, text: "그런가" },
      ]);
    } else {
      navigate("/social"); // 사진에 관한 데이터가 없다면 소셜 페이지로 이동동
    }
  }, [photoId, navigate]);

  const handleLike = () => setLikes(likes + 1);
  const handleComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: comments.length + 1, text: newComment }]);
      setNewComment("");
    }
  };

  return (
    <div className="photo-page-container">
      {photo ? (
        <>
          <img src={photo.url} alt="Ride photo" className="photo-large" />
          <p>{photo.description}</p>
          
          <button onClick={handleLike}>👍 Like ({likes})</button>

          <h3>Comments</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>{comment.text}</li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleComment}>💬 Post</button>

          <button onClick={() => navigate(-1)}>🔙 Back</button>
        </>
      ) : (
        <p>Loading photo...</p>
      )}
    </div>
  );
};

export default PhotoPage;
