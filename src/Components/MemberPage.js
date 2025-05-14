import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMemberProfile, getMemberRideList } from "./Auth";

const MemberPage = () => {
    const { memberId } = useParams();
    const [profile, setProfile] = useState(null);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, rideRes] = await Promise.all([
                    getMemberProfile(memberId),
                    getMemberRideList(memberId)
                ]);

                if (!profileRes.success) throw new Error("프로필 정보를 불러오지 못했습니다.");
                if (!rideRes.success) throw new Error("주행 기록 정보를 불러오지 못했습니다.");

                setProfile(profileRes.data);
                setRides(rideRes.data);
            } catch (err) {
                setError(err.message || "데이터 로딩 실패");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [memberId]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="member-profile">
            <h2>{profile.nickname}의 프로필</h2>
            {profile.profileImageUrl && (
                <img
                    src={profile.profileImageUrl}
                    alt={`${profile.nickname}의 프로필`}
                />
            )}
            <p>닉네임: {profile.nickname}</p>

            <h3>주행 기록</h3>
            {rides.length === 0 ? (
                <p>등록된 주행 기록이 없습니다.</p>
            ) : (
                <ul>
                    {rides.map((ride) => (
                        <li key={ride.recordId}>
                            <p>주행 시작: {ride.startTime}</p>
                            <Link to={`/ride/${ride.recordId}`}>경로 보기</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MemberPage;
