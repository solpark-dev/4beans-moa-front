import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

import MainPage from "./pages/main/MainPage";
import PartyListPage from "./pages/party/PartyListPage";
import PartyDetailPage from "./pages/party/PartyDetailPage";

import AddUserPage from "./pages/user/AddUserPage";
import LoginPage from "./pages/user/LoginPage";
import FindIdPage from "./pages/user/FindIdPage";
import ResetPwdPage from "./pages/user/ResetPwdPage";
import MyPage from "./pages/user/MyPage";
import EmailVerifiedPage from "./pages/user/EmailVerifiedPage";

import CommunityPage from "./pages/community/CommunityPage";

import { requireLogin } from "./services/authGuard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <Routes>
          {/* 메인/파티 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/party" element={<PartyListPage />} />
          <Route path="/party/:id" element={<PartyDetailPage />} />

          {/* User 도메인 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<AddUserPage />} />
          <Route path="/find-email" element={<FindIdPage />} />
          <Route path="/reset-password" element={<ResetPwdPage />} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />
          <Route
            path="/mypage"
            element={requireLogin() ? <MyPage /> : <Navigate to="/login" replace />}
          />

          {/* 커뮤니티 */}
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
