// src/api/userApi.js
import httpClient from "@/api/httpClient";

export const getUser = () => httpClient.get("/users/me");

export const getUserList = (params) =>
  httpClient.get("/users/list", { params });

export const updateUser = (data) => httpClient.post("/users/update", data);

export const updatePwd = (data) => httpClient.post("/users/updatePwd", data);

export const uploadProfileImage = (formData) =>
  httpClient.post("/users/uploadProfileImage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const resetPwdByOldApi = (data) =>
  httpClient.post("/users/resetPwd", data);

export const startResetPwdByToken = (data) =>
  httpClient.post("/users/resetPwd/start", data);

export const resetPwdByToken = (data) =>
  httpClient.post("/users/resetPwd", data);

export const withdrawUser = (data) => httpClient.post("/users/delete", data);

export const getMyAccount = () => httpClient.get("/users/me/account");

export const getMyCard = () => httpClient.get("/users/me/card");
