import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyPage } from "./Auth";      // 실제 API 호출용
import { testUser } from "./dummyData";  // 더미 모드용
import "../Styles/Desktop/ChangeNick.css";

const ChangeNick = () => {
  const [newNickname, setNewNickname] = useState("");
  const [message, setMessage]         = useState("");
  const [nickname, setNickname]       = useState("");
  const navigate = useNavigate();

  // ① 초기 닉네임 로드
  useEffect(() => {
    const currentUserId = localStorage.getItem("userId") || "";
    if (currentUserId === testUser.userId) {
      // 웹테스트 모드
      setNickname(testUser.nickname);
    } else {
      // 실제 모드: API 호출
      getMyPage()
        .then((res) => {
          if (res.success && res.data.nickname) {
            setNickname(res.data.nickname);
          } else {
            navigate("/signin");
          }
        })
        .catch(() => {
          navigate("/signin");
        });
    }
  }, [navigate]);

  const handleChangeNick = (e) => {
    e.preventDefault();
    if (!newNickname.trim()) {
      setMessage("새 닉네임을 입력해 주세요.");
      return;
    }

    const currentUserId = localStorage.getItem("userId") || "";
    if (currentUserId === testUser.userId) {
      // 더미 모드
      testUser.nickname = newNickname;
      setNickname(newNickname);
      setMessage("더미 모드: 닉네임이 변경되었습니다.");
    } else {
      // 실제 모드: TODO: API 호출 로직
      // 예: await changeNickname(newNickname);
      setMessage("서버 모드는 아직 구현되지 않았습니다.");
    }
    setNewNickname("");
  };

  return (
    <div className="changenick-container">
      <h2>닉네임 변경</h2>
      <form onSubmit={handleChangeNick} className="changenick-form">
        <input
          type="text"
          placeholder="새로운 닉네임 입력"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
        />
        <button type="submit">변경하기</button>
      </form>
      {message && <p className="changenick-message">{message}</p>}
      <p className="changenick-current">
        현재 닉네임: <span className="current-value">{nickname}</span>
      </p>
    </div>
  );
};

export default ChangeNick;
