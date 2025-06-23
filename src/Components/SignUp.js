import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "./Auth";
import "../Styles/Desktop/SignUp.css";

export default function SignUp() {
  const [values, setValues] = useState({
    userId: "",
    password: "",
    password2: "",
    name: "",
    email: "",
    nickname: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (
    !values.userId ||
    !values.password ||
    !values.password2 ||
    !values.name ||
    !values.email ||
    !values.nickname
  ) {
    setError("모든 항목을 입력해 주세요.");
    return;
  }

  if (values.password !== values.password2) {
    setError("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const result = await register(values);
    if (result.success) {
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate("/signin");
    } else {
      setError(result.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  } catch {
    setError("회원가입에 실패했습니다. 다시 시도해주세요.");
  }
};


  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <input
            type="text"
            id="userId"
            value={values.userId}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password2">비밀번호 확인</label>
          <input
            type="password"
            id="password2"
            value={values.password2}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={values.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={values.nickname}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button">
          회원가입
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
);
}
