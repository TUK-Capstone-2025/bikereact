import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "./Auth";

const CreateTeam = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name.trim()) {
            setError("팀 이름은 필수입니다.");
            return;
        }

        try {
            const res = await createTeam({ name, description });
            if (res.success) {
                setSuccess("팀이 성공적으로 생성되었습니다.");
                setTimeout(() => navigate("/my-team"), 1000); // 자동 이동
            } else {
                setError(res.message || "팀 생성 실패");
            }
        } catch (err) {
            setError("요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="create-team-container">
            <h2>팀 만들기</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="팀 이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="팀 설명 (선택)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">팀 생성</button>
            </form>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
        </div>
    );
};

export default CreateTeam;
