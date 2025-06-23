// src/pages/ChangeId.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeUserId } from "./Auth";       // Auth.js 경로에 맞춰 조정
import "../Styles/Desktop/ChangeId.css";

export default function ChangeId() {
  const [newUserId, setNewUserId] = useState("");
  const [message, setMessage]     = useState("");
  const [status, setStatus]       = useState("");
  const navigate = useNavigate();

  const handleChangeId = async (e) => {
    e.preventDefault();
    setMessage("");
    setStatus("");

    try {
      const res = await changeUserId(newUserId);
      if (res.success) {
        // 1) localStorage에 저장해 두지 않으면
        //    다른 페이지에서 여전히 이전 userId를 읽어가고
        //    “로그인되지 않음” 취급됩니다.
        localStorage.setItem("userId", newUserId);

        setStatus("아이디가 성공적으로 변경되었습니다.");
      } else {
        setMessage(res.message || "아이디 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="changeid-container">
      <h2>아이디 변경</h2>

      <form onSubmit={handleChangeId} className="changeid-form">
        <input
          type="text"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          placeholder="새로운 아이디 입력"
          required
        />
        <button type="submit">아이디 변경</button>
      </form>

      {status && <p className="changeid-success">{status}</p>}
      {message && <p className="changeid-error">{message}</p>}
    </div>
  );
}
