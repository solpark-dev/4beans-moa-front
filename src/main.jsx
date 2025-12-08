import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./assets/global.css";
import App from "./App.jsx";
import ChatBotWidget from "@/components/common/ChatBotWidget";
import { useAuthStore } from "@/store/authStore";

useAuthStore.getState().fetchSession();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <ChatBotWidget />
  </BrowserRouter>
);
