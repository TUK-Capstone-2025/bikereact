import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error message before new request

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${your.jwt.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }), 
      });

      const data = await response.text(); // Since response is plain text ("로그인 성공")

      if (response.ok && data.includes("로그인 성공")) {
        console.log("Login successful:", data);
        onLogin({ userId }); // Pass user data to parent component
        navigate("/"); // Redirect to main page
      }else{

      }
    } catch (err) {
      setError(`네트워크 오류: ${err.message}`);
      console.error("Login error:", err);
    }
  };

  const handleSkip = () => {
    onLogin(); // Assume login for admin/testing purposes
    navigate("/");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">로그인</button>
      </form>
      <button className="register-button" onClick={() => navigate("/register")}>
        회원가입
      </button>
      <button onClick={handleSkip} className="skip-button">
        로그인 스킵(관리자용)
      </button>
    </div>
  );
};

export default Login;
