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
        nickname: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!values.userId || !values.password || !values.password2 || !values.name || !values.email || !values.nickname) {
            setError("All fields are required.");
            return;
        }

        if (values.password !== values.password2) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await register(values);
            alert("Sign up successful! Please log in.");
            navigate("/signin");
        } catch (error) {
            setError("Sign up failed. Try again.");
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="signup-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userId">ID</label>
                        <input type="text" id="userId" onChange={handleChange} value={values.userId} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" onChange={handleChange} value={values.password} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password2">Confirm Password</label>
                        <input type="password" id="password2" onChange={handleChange} value={values.password2} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" onChange={handleChange} value={values.name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" onChange={handleChange} value={values.email} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nickname">Nickname</label>
                        <input type="text" id="nickname" onChange={handleChange} value={values.nickname} />
                    </div>
                    <button type="submit">SIGN UP</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
}
