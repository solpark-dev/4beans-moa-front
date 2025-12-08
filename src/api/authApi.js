// src/api/authApi.js
import httpClient from "./httpClient";

export const fetchCurrentUser = () => httpClient.get("/users/me");

export const login = (data) => httpClient.post("/auth/login", data);

export const logout = () => httpClient.post("/auth/logout");

export const signup = (data) => httpClient.post("/users/add", data);

export const verifyEmail = (token) => httpClient.post(`/auth/verify-email?token=${token}`);

export const checkCommon = (data) => httpClient.post("/users/check", data);

export const checkPasswordFormat = (password) =>
  httpClient.post("/users/checkPasswordFormat", { password });

export const checkPasswordConfirm = (password, passwordConfirm) =>
  httpClient.post("/users/checkPasswordConfirm", { password, passwordConfirm });

export const startPassAuth = () => httpClient.get("/users/pass/start");

export const verifyPassAuth = (data) =>
  httpClient.post("/users/pass/verify", data);

export const startRestoreVerify = (userId) =>
  httpClient.post("/users/restore/start", { userId });
