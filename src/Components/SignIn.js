import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./Auth";
import { testUser } from "./dummyData";
import "../Styles/Desktop/SignIn.css";

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
        if (!values.userId || !values.password) {
            setError("Please enter both ID and Password.");
            return;
        }

        if (values.userId === testUser.userId && values.password === testUser.password) {
            localStorage.clear();
            localStorage.setItem("tokenType", "Bearer");
            localStorage.setItem("accessToken", "dummy-access-token");
            localStorage.setItem("refreshToken", "dummy-refresh-token");
            localStorage.setItem("userId", testUser.userId);  // ✅ 요거 추가!
            onSignIn(true);
            navigate("/");
            return;
        }
        

        try {
            const response = await login(values);
            localStorage.clear();
            localStorage.setItem("tokenType", response.tokenType);
            localStorage.setItem("accessToken", response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);
            onSignIn(true);
            navigate("/");
        } catch (error) {
            setError("Login failed. Check credentials.");
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="signin-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userId">ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="userId"
                            onChange={handleChange}
                            value={values.userId}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">PASSWORD</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="password"
                                onChange={handleChange}
                                value={values.password}
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁‍🗨" : "👁"}
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <button type="submit">SIGN IN</button>
                    </div>
                    {error && <p className="error">{error}</p>}
                </form>

                <button className="register-button" onClick={() => navigate("/signup")}>
                    Don't have an account? Sign up
                </button>
            </div>
        </div>
    );
}
