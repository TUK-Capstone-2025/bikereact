import axios from "axios";

const BASE_URL = "https://2b00-1-237-205-122.ngrok-free.app/api";

export const AuthApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔹 Interceptor: Attach token to all requests
AuthApi.interceptors.request.use((config) => {
<<<<<<< Updated upstream
    const ACCESS_TOKEN = localStorage.getItem("accessToken") || "";
    if (ACCESS_TOKEN) {
        config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
=======
    const ACCESS_TOKEN = localStorage.getItem("accessToken");
  
    // 토큰이 있어도 로그인/회원가입 요청엔 붙이지 않음
    const isAuthFreeEndpoint = config.url.includes("/member/login") || config.url.includes("/member/register");
  
    if (!isAuthFreeEndpoint && ACCESS_TOKEN && ACCESS_TOKEN.includes('.') && ACCESS_TOKEN.split('.').length === 3) {
      config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    } else {
      delete config.headers.Authorization;
>>>>>>> Stashed changes
    }
  
    return config;
<<<<<<< Updated upstream
});

/** 🔹 LOGIN API */
export const login = async ({ userId, password }) => {
    try {
        const response = await AuthApi.post("/member/login", { userId, password });

        console.log("Raw Response: ", response);
=======
  });
  
export const login = async ({ userId, password }) => {
    try {
        const response = await AuthApi.post("/member/login", { userId, password });
        

        const accessToken = response?.data?.data;
        console.log("서버 응답 전체:", response.data);
        console.log("토큰?:", response?.data?.data);
>>>>>>> Stashed changes

        if (!response.data || !response.data.data) {
            throw new Error("Invalid response format from server.");
        }

        const accessToken = response.data.data;
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

/** 🔹 SIGNUP API */
export const register = async (userData) => {
    try {
        const response = await AuthApi.post("/member/register", userData);

        console.log("Signup Response: ", response);

        if (!response.data || !response.data.data) {
            throw new Error("Invalid response format from server.");
        }

        const accessToken = response.data.data;
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

export const getMyPage = async () => {
    try {
        const response = await AuthApi.get("/member/me");
        console.log("서버 응답 전체:", response.data);
        return response.data;
    } catch (error) {
        console.error("마이페이지 정보 가져오기 실패:", error);
        throw error;
    }
};
