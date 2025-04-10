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
    const ACCESS_TOKEN = localStorage.getItem("accessToken") || "";
    if (ACCESS_TOKEN) {
        config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    }
    return config;
});

/** 🔹 LOGIN API */
export const login = async ({ userId, password }) => {
    try {
        const response = await AuthApi.post("/member/login", { userId, password });

        console.log("Raw Response: ", response);

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
