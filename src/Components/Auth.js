import axios from "axios";

const BASE_URL = "https://339c-210-99-254-13.ngrok-free.app/api";

export const AuthApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// 🔹 Interceptor: Attach token to all requests
AuthApi.interceptors.request.use((config) => {
    const ACCESS_TOKEN = localStorage.getItem("accessToken");

    // 로그인/회원가입 요청에는 토큰을 붙이지 않음
    const isAuthFreeEndpoint =
        config.url.includes("/member/login") || config.url.includes("/member/register");

    if (!isAuthFreeEndpoint && ACCESS_TOKEN && ACCESS_TOKEN.includes(".") && ACCESS_TOKEN.split(".").length === 3) {
        config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
});

// 🔹 LOGIN API
export const login = async ({ userId, password }) => {
    try {
        // 로그인 요청 시 기존 토큰 제거
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenType");

        const response = await AuthApi.post("/member/login", { userId, password });

        console.log("서버 응답 전체:", response.data);
        const accessToken = response?.data?.data;
        console.log("토큰?:", accessToken);

        if (!accessToken) {
            throw new Error("Access token not received from the server.");
        }

        // ✅ Store token
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("tokenType", "Bearer");

        return { accessToken, tokenType: "Bearer" };
    } catch (error) {
        console.error("Auth login error: ", error);
        throw error;
    }
};

// 🔹 SIGNUP API
export const register = async (userData) => {
  try {
    const response = await AuthApi.post("/member/register", userData);
    console.log("Signup Response:", response.data);
    // 서버는 토큰을 반환하지 않으므로 성공 여부만 리턴
    return response.data;  // { success, message, data: null }
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};


// 🔹 MY PAGE API
export const getMyPage = async () => {
    try {
        const response = await AuthApi.get("/member/me");
        console.log("서버 응답 전체:", response.data);
        return response.data;
    } catch (error) {
        // 403 에러가 발생할 경우 처리
        if (error.response && error.response.status === 403) {
            console.error("잘못된 토큰 또는 만료된 토큰으로 인해 접근이 거부되었습니다.");
            localStorage.removeItem("accessToken");  // 기존 토큰 삭제
        }
        console.error("마이페이지 정보 가져오기 실패:", error);
        throw error;
    }
};
// 🔹 GET My Ride List (목록)
export const getMyRideList = async () => {
  try {
    const response = await AuthApi.get("/record/list");
    console.log("주행 기록 응답:", response.data);
    return response.data;   // 정상(200) + { success, message, data }
  } catch (error) {
    // 404 등 에러 응답에도 JSON body를 그대로 리턴
    if (
      error.response &&
      (error.response.status === 404 || error.response.status === 400) &&
      error.response.data
    ) {
      console.warn("주행 기록 없음 응답:", error.response.data);
      return error.response.data;  // { success:false, message, data:null }
    }
    console.error("내 라이딩 목록 조회 중 예외:", error);
    throw error;
  }
};


// 🔹 GET Ride Detail by ID
export const getMyRideDetail = async (recordId) => {
    try {
        const response = await AuthApi.get(`/record/my/route/${recordId}`);
        console.log(`기록 ${recordId}의 상세 정보:`, response.data);
        return response.data; // ✅ 전체 객체 { success, message, data: {...} } 반환
    } catch (error) {
        console.error("라이딩 상세 정보 가져오기 실패:", error);
        throw error;
    }
};

export const getMyTeam = async () => {
    try {
        const response = await AuthApi.get("/member/team");
        return response.data; // { success, message, data: { isInTeam, teamId } }
    } catch (error) {
        console.error("팀 정보 가져오기 실패:", error);
        throw error;
    }
};

export const getTeamDetail = async (teamId) => {
    try {
        const response = await AuthApi.get(`/team/${teamId}`);
        console.log("팀 상세 정보:", response.data);
        return response.data;
    } catch (error) {
        console.error("팀 상세 정보 조회 실패:", error);
        throw error;
    }
};

export const getMemberProfile = async (memberId) => {
    try {
        const response = await AuthApi.get(`/team/member/profile/${memberId}`);
        return response.data; // { success, message, data: { ...프로필 정보 } }
    } catch (error) {
        console.error("멤버 프로필 조회 실패:", error);
        throw error;
    }
};
export const getMemberRideList = async (memberId) => {
    try {
        const response = await AuthApi.get(`/record/member/${memberId}`);
        return response.data; // { success, data: [...] }
    } catch (error) {
        console.error("멤버 주행 기록 조회 실패:", error);
        throw error;
    }
};
export const getOtherRideDetail = async (recordId) => {
    const response = await AuthApi.get(`/record/other/route/${recordId}`);
    return response.data;
};
export const getTeamList = async () => {
    try {
        const response = await AuthApi.get("/team/list");
        return response.data; // { success, data: [...] }
    } catch (error) {
        console.error("팀 목록 조회 실패:", error);
        throw error;
    }
};
export const applyToTeam = async (teamId) => {
    try {
        const response = await AuthApi.post(`/member/applyTeam/${teamId}`);
        return response.data; // { success: true/false, message: "..." }
    } catch (error) {
        console.error("팀 참가 신청 실패:", error);
        throw error;
    }
};
export const getApplyList = async () => {
  try {
    const response = await AuthApi.get("/member/applyStatus");
    return response.data; // { success, data: [...] }
  } catch (error) {
    console.error("신청 목록 조회 실패:", error);
    throw error;
  }
};

export const cancelTeamApplication = async (teamId) => {
    try {
        const response = await AuthApi.delete("/member/cancel", {
            data: { teamId }, // DELETE 요청의 body는 여기서 지정
        });
        return response.data; // { success, message }
    } catch (error) {
        console.error("팀 신청 취소 실패:", error);
        throw error;
    }
};
export const createTeam = async (teamData) => {
    try {
        const response = await AuthApi.post("/team/create", teamData);
        return response.data; // { success, message, data }
    } catch (error) {
        console.error("팀 생성 실패:", error);
        throw error;
    }
};
export const getTeamApplications = async () => {
    try {
        const response = await AuthApi.get("/member/listMembers");
        return response.data; // { success, data: [...] }
    } catch (error) {
        console.error("신청자 목록 조회 실패:", error);
        throw error;
    }
};
// 🔹 멤버 승인 API
export const approveMember = async (memberId) => {
  try {
    const response = await AuthApi.post("/team/approve", { memberId });
    return response.data; // { success, message, data }
  } catch (error) {
    console.error("멤버 승인 실패:", error);
    throw error;
  }
};

// 🔹 멤버 거절 API
export const rejectMember = async (memberId) => {
  try {
    const response = await AuthApi.post("/team/reject", { memberId });
    return response.data; // { success, message, data }
  } catch (error) {
    console.error("멤버 거절 실패:", error);
    throw error;
  }
};

export const kickMemberFromTeam = async (memberId) => {
    try {
        const response = await AuthApi.post(`/team/kick/${memberId}`);
        return response.data;
    } catch (error) {
        console.error("멤버 퇴출 실패:", error);
        throw error;
    }
};
export const changePassword = async ({ oldPassword, newPassword }) => {
  try {
    const response = await AuthApi.put("/member/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data; // { success, message }
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    throw error;
  }
};
// 🔹 아이디 변경 API
export const changeUserId = async (newUserId) => {
  try {
    const response = await AuthApi.post("/member/changeId", {
      newUserId,
    });
    return response.data; // { success, message, data }
  } catch (error) {
    console.error("아이디 변경 실패:", error);
    throw error;
  }
};