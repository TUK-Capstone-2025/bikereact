// dummyData.js
export const testUser = {
    userId: "webtest",
    password: "123",
    tokenType: "Bearer",
    accessToken: "dummy_access_token",
    nickname: "webtestNickname",  // 더미 데이터에 닉네임 추가
};

export const dummyTeam = {
    teamId: 1,
    teamName: "자전거 라이더즈",  // 팀 이름
    members: [
        { userId: "webtest", nickname: "webtestNickname" },
        // 다른 팀원도 여기에 추가 가능
    ],
    description: "자전거를 좋아하는 사람들이 모인 팀입니다.",
    createdAt: "2025-04-25",  // 팀 생성일
};

export const dummyRides = [
    {
        id: 1,
        name: "아침 라이딩",
        distance: "12 km",
        duration: "40분",
        coordinates: [
            { lat: 37.5665, lng: 126.978 },
            { lat: 37.5705, lng: 126.982 },
            { lat: 37.5745, lng: 126.986 },
        ],
    },
    {
        id: 2,
        name: "오후 라이딩",
        distance: "15 km",
        duration: "50분",
        coordinates: [
            { lat: 37.541, lng: 127.056 },
            { lat: 37.550, lng: 127.074 },
            { lat: 37.564, lng: 127.098 },
        ],
    },
    {
        id: 3,
        name: "저녁 라이딩",
        distance: "10 km",
        duration: "30분",
        coordinates: [
            { lat: 37.498, lng: 127.027 },
            { lat: 37.505, lng: 127.036 },
            { lat: 37.513, lng: 127.048 },
        ],
    },
];
