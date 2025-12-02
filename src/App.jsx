import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

import ProtectedRoute from "@/routes/ProtectedRoute";
import OAuthKakaoPage from "./pages/oauth/OAuthKakaoPage";
import OAuthGooglePage from "./pages/oauth/OAuthGooglePage";
import MainPage from "./pages/main/MainPage";
import PartyListPage from "./pages/party/PartyListPage";
import PartyDetailPage from "./pages/party/PartyDetailPage";

import AddUserPage from "./pages/user/AddUserPage";
import LoginPage from "./pages/user/LoginPage";
import FindIdPage from "./pages/user/FindIdPage";
import ResetPwdPage from "./pages/user/ResetPwdPage";
import UpdatePwdPage from "./pages/user/UpdatePwdPage";
import DeleteUserPage from "./pages/user/DeleteUserPage";
import MyPage from "./pages/user/MyPage";
import EmailVerifiedPage from "./pages/user/EmailVerifiedPage";
import UpdateUserPage from "./pages/user/UpdateUserPage";

import GetProductList from "./pages/product/GetProductList";
import GetProduct from "./pages/product/GetProduct";
import AddProduct from "./pages/product/AddProduct";
import UpdateProduct from "./pages/product/UpdateProduct";
import DeleteProduct from "./pages/product/DeleteProduct";

import AddSubscription from "./pages/subscription/AddSubscription";
import GetSubscriptionList from "./pages/subscription/GetSubscriptionList";
import GetSubscription from "./pages/subscription/GetSubscription";
import UpdateSubscription from "./pages/subscription/UpdateSubscription";
import CancelSubscription from "./pages/subscription/CancelSubscription";

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

          {/* ===== OAuth 콜백 MUST BE PUBLIC ===== */}
          <Route path="/oauth/kakao" element={<OAuthKakaoPage />} />
          <Route path="/oauth/google" element={<OAuthGooglePage />} />

          {/* User 도메인 (Public) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<AddUserPage />} />
          <Route path="/find-email" element={<FindIdPage />} />
          <Route path="/reset-password" element={<ResetPwdPage />} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />

          {/* User 도메인 (Protected) */}
          <Route
            path="/mypage"
            element={<ProtectedRoute element={<MyPage />} />}
          />
          <Route
            path="/mypage/password"
            element={<ProtectedRoute element={<UpdatePwdPage />} />}
          />
          <Route
            path="/mypage/delete"
            element={<ProtectedRoute element={<DeleteUserPage />} />}
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

          {/* Product (Public) */}
          <Route path="/product" element={<GetProductList />} />
          <Route path="/product/:id" element={<GetProduct />} />

          {/* Product (Admin) */}
          <Route
            path="/product/add"
            element={<ProtectedRoute element={<AddProduct />} />}
            // TODO: Add role check for ADMIN
          />
          <Route
            path="/product/:id/edit"
            element={<ProtectedRoute element={<UpdateProduct />} />}
            // TODO: Add role check for ADMIN
          />
          <Route
            path="/product/:id/delete"
            element={<ProtectedRoute element={<DeleteProduct />} />}
            // TODO: Add role check for ADMIN
          />

          {/* Subscription (User) */}
          <Route
            path="/subscription/add/:productId"
            element={<ProtectedRoute element={<AddSubscription />} />}
          />
          <Route
            path="/subscription"
            element={<ProtectedRoute element={<GetSubscriptionList />} />}
          />
          <Route
            path="/subscription/:id"
            element={<ProtectedRoute element={<GetSubscription />} />}
          />
          <Route
            path="/subscription/:id/edit"
            element={<ProtectedRoute element={<UpdateSubscription />} />}
          />
          <Route
            path="/subscription/:id/cancel"
            element={<ProtectedRoute element={<CancelSubscription />} />}
          />

          {/* 고객센터/커뮤니티 */}
          <Route path="/support" element={<SupportPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
