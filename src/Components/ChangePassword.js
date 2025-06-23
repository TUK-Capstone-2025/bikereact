// ChangePassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "./Auth";
import { testUser } from "./dummyData";       // dummy 유저 정보
import "../Styles/Desktop/ChangePassword.css";

export default function ChangePassword() {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { currentPassword, newPassword, confirmPassword } = values;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("모든 항목을 입력해 주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const currentUserId = localStorage.getItem("userId") || "";

    // ── 웹 테스트 모드: dummyData 사용 ──
    if (currentUserId === testUser.userId) {
      if (currentPassword !== testUser.password) {
        setError("현재 비밀번호가 올바르지 않습니다.");
        return;
      }
      // dummyData의 비밀번호를 업데이트 (메모리 상)
      testUser.password = newPassword;
      setSuccess("더미 모드: 비밀번호가 변경되었습니다.");
      // 2초 후 마이페이지로 이동
      setTimeout(() => navigate("/mypage"), 2000);
      return;
    }

    // ── 일반 모드: 실제 API 호출 ──
    try {
      const res = await AuthApi.post("/member/changePass", {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        setSuccess("비밀번호가 성공적으로 변경되었습니다.");
        setTimeout(() => navigate("/mypage"), 2000);
      } else {
        setError(res.data.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="cpw-container">
      <form className="cpw-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            type="password"
            id="currentPassword"
            value={values.currentPassword}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">새 비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="submit-button">
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}
