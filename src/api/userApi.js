// src/api/userApi.js
import httpClient from "@/api/httpClient";

/* =========================== 조회 =========================== */
export const getUser = () =>
  httpClient.get("/users/me");

export const getUserList = (params) =>
  httpClient.get("/users/list", { params });

/* =========================== 등록 =========================== */
export const addUser = (data) =>
  httpClient.post("/users/add", data);

/* =========================== 수정 =========================== */
export const updateUser = (data) =>
  httpClient.post("/users/update", data);

export const updatePwd = (data) =>
  httpClient.post("/users/updatePwd", data);

export const updatePhoneByPassAuth = (data) =>
  httpClient.put("/users/phone", data);

export const uploadProfileImage = (formData) =>
  httpClient.post("/users/uploadProfileImage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================== 비번 재설정 =========================== */
export const resetPwdByOldApi = (data) =>
  httpClient.post("/users/resetPwd", data);

export const startResetPwdByToken = (data) =>
  httpClient.post("/users/password/reset/start", data);

export const resetPwdByToken = (data) =>
  httpClient.post("/users/password/reset", data);

/* =========================== 삭제(탈퇴) =========================== */
export const withdrawUser = (data) =>
  httpClient.post("/users/delete", data);

/* =========================== 지갑 관련 =========================== */
export const getMyAccount = () =>
  httpClient.get("/users/me/account");

export const getMyCard = () =>
  httpClient.get("/users/me/card");
