// dummyData.js
export const testUser = {
  userId: "webtest",
  password: "123",
  tokenType: "Bearer",
  accessToken: "dummy_access_token",
  nickname: "webtestNickname",
  profileImageUrl: "/default_profilePic.svg", // 더미 프로필 이미지 URL
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

// ────────────── 더미 팀 상세 정보 ──────────────
// 실제 API에서 getTeamDetail()이 반환하는 shape에 맞춰서 작성
export const dummyTeamDetail = {
  // 팀 이름
  name: "자전거 라이더즈 (더미)",
  // 팀장(leader)는 memberId와 동일하게 'webtest'로 설정
  leader: "webtest",
  // memberCount는 members 배열 길이와 같아야 함
  memberCount: 3,
  // members 배열: 각 멤버가 { memberId, nickname, name, profileImageUrl } 형태
  members: [
    {
      memberId: "webtest",
      nickname: "webtestNickname",
      name: "테스트 사용자",
      profileImageUrl:
        "https://via.placeholder.com/40?text=Web", // 더미 프로필 URL
    },
    {
      memberId: "member2",
      nickname: "멤버투",
      name: "두번째 멤버",
      profileImageUrl:
        "https://via.placeholder.com/40?text=User2",
    },
    {
      memberId: "member3",
      nickname: "멤버쓰리",
      name: "세번째 멤버",
      profileImageUrl: null, // 프로필이 없는 경우
    },
  ],
};
// ────────────── 더미 팀 목록 ──────────────
export const dummyTeamList = [
  {
    teamId: 101,
    name: "더미 라이더즈 A",
  },
  {
    teamId: 102,
    name: "더미 라이더즈 B",
  },
  {
    teamId: 103,
    name: "더미 라이더즈 C",
  },
];
export const dummyApplyList = [
  {
    teamId: 201,
    teamName: "더미 팀 A",
    status: "WAITING",    // 대기 중
  },
  {
    teamId: 202,
    teamName: "더미 팀 B",
    status: "APPROVE",    // 승인됨
  },
  {
    teamId: 203,
    teamName: "더미 팀 C",
    status: "REJECT",     // 거절됨
  },
];