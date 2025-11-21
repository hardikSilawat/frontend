"use client";
import Cookies from "js-cookie";
import axios from "axios";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.location.pathname.startsWith("/admin")
    ? Cookies.get("AdminToken")
    : Cookies.get("UserToken");
};

const request = async (method, url, data = null) => {
  if (!process.env.NEXT_PUBLIC_SERVER_BASE_URL) {
    throw new Error("API Base URL is not configured.");
  }

  const config = {
    method,
    url: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${url}`,
    headers: {
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
    ...(data && { data }),
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message);
  }
};

export const api = {
  get: (url) => request("GET", url),
  post: (url, data) => request("POST", url, data),
  put: (url, data) => request("PUT", url, data),
  delete: (url) => request("DELETE", url),
};

export default api;
