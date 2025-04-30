import { useEffect, useState } from "react";
import { getMyPage } from "./Auth";
import "../Styles/Desktop/MyPage.css"; // 스타일 파일은 필요에 따라 생성

export default function MyPage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getMyPage();
                setUser(data);
            } catch (err) {
                setError("사용자 정보를 불러오는 데 실패했습니다.");
            }
        };

        fetchUserData();
    }, []);

    if (error) return <div>{error}</div>;
    if (!user) return <div>로딩 중...</div>;

    return (
        <div className="mypage-container">
            <h2>마이페이지</h2>
            <p><strong>아이디:</strong> {user.userId}</p>
            <p><strong>이메일:</strong> {user.email}</p>
            <p><strong>닉네임:</strong> {user.nickname}</p>
            {/* 필요한 항목 추가 */}
        </div>
    );
}
