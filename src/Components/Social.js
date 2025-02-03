import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Social.css";

const Social = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Placeholder function to simulate fetching data from a backend
  useEffect(() => {
    // API call로 대체될 부분
    setFriends([
      { id: 1, name: "민지", lastActive: "10 분 전" },
      { id: 2, name: "세희", lastActive: "1 시간 전" },
    ]);
    setFriendRequests([{ id: 3, name: "철수" }]);
  }, []);

  const handleAcceptRequest = (id) => {
    console.log("Accepted request from", id);
    setFriendRequests(friendRequests.filter((req) => req.id !== id));
  };

  const handleDeclineRequest = (id) => {
    console.log("Declined request from", id);
    setFriendRequests(friendRequests.filter((req) => req.id !== id));
  };

  return (
    <div className="social-container">
      <h1>소셜</h1>
      <button onClick={() => navigate("/")}>🏠 메인 화면으로 돌아가기</button>

      {/* 검색 & 친구 추가 */}
      <div className="friend-search">
        <input
          type="text"
          placeholder="친구 검색하기"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => console.log("Searching for:", searchTerm)}>🔍 검색</button>
      </div>

      {/* 친구 요청 */}
      <h2>친구 요청</h2>
      <ul className="friend-requests">
        {friendRequests.length === 0 ? (
          <p>새 친구 요청 없음</p>
        ) : (
          friendRequests.map((request) => (
            <li key={request.id}>
              {request.name}
              <button onClick={() => handleAcceptRequest(request.id)}>✔️ 수락</button>
              <button onClick={() => handleDeclineRequest(request.id)}>❌ 거부</button>
            </li>
          ))
        )}
      </ul>

      {/* Friends List */}
      <h2>친구 목록</h2>
      <ul className="friend-list">
        {friends.length === 0 ? <p>친구 없음</p> : (
          friends.map((friend) => (
            <li key={friend.id}>
              <Link to={`/friend/${friend.id}`}>{friend.name}</Link>
              <span className="last-active">({friend.lastActive})</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Social;
