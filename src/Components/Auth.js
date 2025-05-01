import axios from "axios";

const BASE_URL = "https://2b00-1-237-205-122.ngrok-free.app/api";

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

        console.log("Signup Response: ", response);

        const accessToken = response?.data?.data;
        if (!accessToken) {
            throw new Error("Access token not received after signup.");
        }

        // ✅ Store token after signup
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("tokenType", "Bearer");

        return { accessToken, tokenType: "Bearer" };
    } catch (error) {
        console.error("Signup error: ", error);
        throw error;
    }
};

// 🔹 MY PAGE API
export const getMyPage = async () => {
    try {
        const response = await AuthApi.post("/member/me");
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
