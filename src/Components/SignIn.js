import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./Auth";
import { testUser } from "./dummyData";
import "../Styles/Desktop/SignIn.css";

/* 눈 아이콘 (보기) */
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    fill="#666"
    width="20"
    height="20"
  >
    <path d="M572.52 241.4C518.5 135.1 409.6 64 288 64S57.5 135.1 3.5 241.4a48 48 0 0 0 0 29.2C57.5 376.9 166.4 448 288 448s230.5-71.1 284.5-177.4a48 48 0 0 0 0-29.2zM288 400c-61.8 0-112-50.2-112-112s50.2-112 112-112s112 50.2 112 112s-50.2 112-112 112z" />
  </svg>
);

/* 눈 감김 아이콘 (숨김) */
const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
    fill="#666"
    width="20"
    height="20"
  >
    <path d="M634 471L85.1 3.5c-9-8-22.6-6.4-30.6 2.6l-20.4 23.1c-8 9-6.4 22.6 2.6 30.6L107 128C63 167.4 31.4 211.4 7 256c24.4 44.6 56 88.6 100 128l-70.9 70.9c-9 8-10.6 21.6-2.6 30.6l23.1 20.4c9 8 22.6 6.4 30.6-2.6l549-467.5c9-8 10.6-21.6 2.6-30.6zM320 400c-61.8 0-112-50.2-112-112 0-16.3 3.5-31.8 9.8-45.8l46.2 39.3C270.3 303.7 320 352 320 352c0 8.8 7.2 16 16 16 0 0 12.1 0 39.4-28.1l46.2 39.3c-14 6.3-29.5 9.8-45.8 9.8zm0-224c16.3 0 31.8 3.5 45.8 9.8l-47 39.9C349.7 208.3 300 160 300 160c-8.8 0-16-7.2-16-16 0 0 0-12.1 28.1-28.1l39.3-46.2C351.8 178.5 336.3 184 320 184z" />
  </svg>
);

export default function SignIn({ onSignIn }) {
  const [values, setValues] = useState({ userId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!values.userId || !values.password) {
      setError("ID와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    // 웹 테스트 모드
    if (
      values.userId === testUser.userId &&
      values.password === testUser.password
    ) {
      localStorage.clear();
      localStorage.setItem("tokenType", "Bearer");
      localStorage.setItem("accessToken", "dummy-access-token");
      localStorage.setItem("refreshToken", "dummy-refresh-token");
      localStorage.setItem("userId", testUser.userId);
      onSignIn(true);
      navigate("/");
      return;
    }

    // 실제 로그인
    try {
      const resp = await login(values);
      localStorage.clear();
      localStorage.setItem("tokenType", resp.tokenType);
      localStorage.setItem("accessToken", resp.accessToken);
      localStorage.setItem("refreshToken", resp.refreshToken);
      onSignIn(true);
      navigate("/");
    } catch {
      setError("로그인 실패. 아이디/비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">ID</label>
          <input
            id="userId"
            type="text"
            value={values.userId}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">PASSWORD</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="show-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
              }
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="submit-button">
          SIGN IN
        </button>
      </form>

      <div className="register-link">
        <span>계정이 없으신가요?</span>
        <button
          type="button"
          className="register-button"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
