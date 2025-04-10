import axios from "axios";

const BASE_URL = "https://2b00-1-237-205-122.ngrok-free.app/api";

export const AuthApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

AuthApi.interceptors.request.use((config) => {
    const ACCESS_TOKEN = localStorage.getItem("accessToken");
    if (ACCESS_TOKEN) {
        config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const login = async ({ userId, password }) => {
    try {
        const response = await AuthApi.post("/member/login", { userId, password });
        console.log("서버 응답:", response.data);

        const accessToken = response?.data?.data;

        if (
            typeof accessToken !== "string" ||
            !accessToken.includes(".") ||
            accessToken.split(".").length !== 3
        ) {
            throw new Error("올바르지 않은 JWT 토큰입니다.");
        }

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("tokenType", "Bearer");

        console.log("로그인 성공, 토큰 저장 완료");
        return { accessToken, tokenType: "Bearer" };
    } catch (error) {
        console.error("로그인 실패:", error?.response?.data || error.message);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await AuthApi.post("/member/register", userData);
        console.log("서버 응답:", response.data);

        const accessToken = response?.data?.data;

        if (
            typeof accessToken !== "string" ||
            !accessToken.includes(".") ||
            accessToken.split(".").length !== 3
        ) {
            throw new Error("올바르지 않은 JWT 토큰입니다.");
        }

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("tokenType", "Bearer");

        console.log("회원가입 성공, 토큰 저장 완료");
        return { accessToken, tokenType: "Bearer" };
    } catch (error) {
        console.error("회원가입 실패:", error?.response?.data || error.message);
        throw error;
    }
};
