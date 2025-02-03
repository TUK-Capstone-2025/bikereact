import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./FriendPage.css";

const FriendPage = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friendName, setFriendName] = useState("");
  const [rides, setRides] = useState([]);

  useEffect(() => {
    // Replace this with an API call later
    const friendData = {
      1: {
        name: "민지",
        rides: [
          { id: 101, name: "탑승 기록 1" },
          { id: 102, name: "탑승 기록 2" },
        ],
      },
      2: {
        name: "세희",
        rides: [{ id: 201, name: "탑승 기록 1" }],
      },
    };

    if (friendData[friendId]) {
      setFriendName(friendData[friendId].name);
      setRides(friendData[friendId].rides);
    } else {
      navigate("/social"); // Redirect if friend not found
    }
  }, [friendId, navigate]);

  return (
    <div className="friend-page-container">
      <h1>{friendName}님의 탑승 기록</h1>
      <ul>
        {rides.length === 0 ? (
          <p>탑승 기록 없음</p>
        ) : (
          rides.map((ride) => (
            <li key={ride.id}>
              <h3>{ride.name}</h3>
              <Link to={`/ride/${ride.id}`}>
                <button>탑승 기록 보기</button>
              </Link>
            </li>
          ))
        )}
      </ul>
      <button onClick={() => navigate("/social")}>🔙 친구 목록으로 돌아가기</button>
    </div>
  );
};

export default FriendPage;
