import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

import ProtectedRoute from "@/routes/ProtectedRoute";
import OAuthKakaoPage from "./pages/oauth/OAuthKakaoPage";
import MainPage from "./pages/main/MainPage";
import PartyListPage from "./pages/party/PartyListPage";
import PartyDetailPage from "./pages/party/PartyDetailPage";

import AddUserPage from "./pages/user/AddUserPage";
import LoginPage from "./pages/user/LoginPage";
import FindIdPage from "./pages/user/FindIdPage";
import ResetPwdPage from "./pages/user/ResetPwdPage";
import MyPage from "./pages/user/MyPage";
import EmailVerifiedPage from "./pages/user/EmailVerifiedPage";
import UpdateUserPage from "./pages/user/UpdateUserPage";

import GetProductList from "./pages/subscription/GetProductList";
import UserSubscriptionList from "./pages/subscription/UserSubscriptionList";

import SupportPage from "./pages/community/SupportPage";

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
            element={<ProtectedRoute element={<MyPage />} />}
          />
          <Route
            path="/mypage/edit"
            element={
              requireLogin() ? (
                <UpdateUserPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/oauth/kakao" element={<OAuthKakaoPage />} />

          {/* product & Subscription */}
          <Route path="/subscriptions" element={<GetProductList />} />
          <Route path="/my/subscriptions" element={<UserSubscriptionList />} />

          <Route path="/support" element={<SupportPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
