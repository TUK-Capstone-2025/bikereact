import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangeProfilePic = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && !/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(file.name)) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            alert("파일 이름에 한글이 포함되지 않도록 해주세요.");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return alert("업로드할 파일을 선택하세요.");

        const formData = new FormData();
        formData.append("file", selectedFile);

        const tokenType = localStorage.getItem("tokenType");
        const accessToken = localStorage.getItem("accessToken");

        try {
            const res = await fetch("/api/member/uploadProfile", {
                method: "POST",
                headers: {
                    Authorization: `${tokenType} ${accessToken}`,
                },
                body: formData,
            });

            const result = await res.json();

            if (res.ok && result.success) {
                alert("프로필 이미지가 성공적으로 업로드되었습니다.");
                // 변경된 이미지 URL을 저장하거나 리디렉션
                navigate("/mypage");
            } else {
                throw new Error(result.message || "업로드 실패");
            }
        } catch (err) {
            console.error("업로드 오류:", err);
            alert("업로드 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="mypage-container">
            <h1 className="mypage-title">프로필 사진 변경</h1>

            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="미리보기"
                    className="profile-image"
                />
            )}

            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div className="button-section">
                <button onClick={handleUpload}>업로드</button>
                <button onClick={() => navigate("/mypage")}>취소</button>
            </div>
        </div>
    );
};

export default ChangeProfilePic;
