import httpClient from "./httpClient";

export const fetchCurrentUser = () => httpClient.get("/users/me");

export const login = (data) =>
  httpClient.post("/users/login", {
    userId: data.userId,
    password: data.password,
  });

export const logout = () => httpClient.post("/users/logout");

export const checkCommon = (data) => httpClient.post("/users/check", data);

export const checkPasswordFormat = (password) =>
  httpClient.post("/users/checkPasswordFormat", { password });

export const checkPasswordConfirm = (password, passwordConfirm) =>
  httpClient.post("/users/checkPasswordConfirm", { password, passwordConfirm });

export const startPassAuth = () => httpClient.get("/users/pass/start");

export const verifyPassAuth = (data) =>
  httpClient.post("/users/pass/verify", data);

export const verifyEmail = (token) =>
  httpClient.get("/users/verify-email", { params: { token } });

export const startRestoreVerify = (userId) =>
  httpClient.post("/users/restore/start", { userId });
