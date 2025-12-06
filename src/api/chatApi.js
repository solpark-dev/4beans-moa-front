// src/api/chatApi.js
import httpClient from "./httpClient";

export const sendChatMessage = (message) =>
  httpClient.post("/chatbot/message", { message });
