import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    onLogin();
    navigate("/");
  };

  const handleSkip = () => {
    onLogin();
    navigate("/");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
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
