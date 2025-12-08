import { Routes, Route } from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { useGlobalLinkHandler } from "@/hooks/common/useGlobalLinkHandler";

import ProtectedRoute from "@/routes/ProtectedRoute";
import OAuthGooglePage from "./pages/oauth/OAuthGooglePage";
import OAuthKakaoPage from "./pages/oauth/OAuthKakaoPage";
import MainPage from "./pages/main/MainPage";
import PartyListPage from "./pages/party/PartyListPage";
import PartyCreatePage from "./pages/party/PartyCreatePage";
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
import FinancialHistoryPage from "./pages/user/FinancialHistoryPage";
import MyWalletPage from "./pages/user/MyWalletPage";
import AccountRegisterPage from "./pages/user/AccountRegisterPage";
import MyPartyListPage from "./pages/party/MyPartyListPage";
import AddBlacklistPage from "./pages/admin/AddBlacklistPage";
import AdminUserListPage from "@/pages/admin/AdminUserListPage";
import AdminUserDetailPage from "@/pages/admin/AdminUserDetailPage";
import AdminBlacklistDeletePage from "@/pages/admin/RemoveBlacklistPage";
import AdminLoginHistoryPage from "@/pages/admin/AdminLoginHistoryPage";  

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
import UserSubscriptionList from "./pages/subscription/UserSubscriptionList";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import BillingSuccessPage from "./pages/payment/BillingSuccessPage";
import BillingRegisterPage from "./pages/payment/BillingRegisterPage";

import ListNotice from "./pages/community/ListNotice";
import GetNotice from "./pages/community/GetNotice";
import AddNotice from "./pages/community/AddNotice";
import UpdateNotice from "./pages/community/UpdateNotice";
import ListFaq from "./pages/community/ListFaq";
import AddFaq from "./pages/community/AddFaq";
import Inquiry from "./pages/community/Inquiry";
import InquiryAdmin from "./pages/community/InquiryAdmin";

export default function App() {
  useGlobalLinkHandler();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <Routes>
          {/* 메인/파티 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/party" element={<PartyListPage />} />
          <Route path="/party/create" element={<PartyCreatePage />} />
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

          {/* User 도메인 (Private - ProtectedRoute 적용) */}
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
            path="/user/financial-history"
            element={<ProtectedRoute element={<FinancialHistoryPage />} />}
          />
          <Route
            path="/user/wallet"
            element={<ProtectedRoute element={<MyWalletPage />} />}
          />
          <Route
            path="/user/my-wallet"
            element={<ProtectedRoute element={<MyWalletPage />} />}
          />
          <Route
            path="/user/account-register"
            element={<ProtectedRoute element={<AccountRegisterPage />} />}
          />
          <Route
            path="/user/account-verify"
            element={<ProtectedRoute element={<AccountRegisterPage />} />}
          />
          <Route
            path="/my-parties"
            element={<ProtectedRoute element={<MyPartyListPage />} />}
          />

          {/* ✅ [수정 2] 복잡한 조건부 렌더링을 ProtectedRoute로 통일 */}
          <Route
            path="/mypage/edit"
            element={<ProtectedRoute element={<UpdateUserPage />} />}
          />

          <Route
            path="/admin/blacklist/add"
            element={<ProtectedRoute element={<AddBlacklistPage />} />}
          />
          <Route path="/admin/users" element={<AdminUserListPage />} />
          <Route
            path="/admin/users/:userId"
            element={<AdminUserDetailPage />}
          />
          <Route
            path="/admin/blacklist/delete"
            element={<AdminBlacklistDeletePage />}
          />
          <Route
            path="/admin/users/:userId/login-history"
            element={<AdminLoginHistoryPage />}
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

          {/* 고객센터/커뮤니티 & 기타 */}
          <Route path="/subscriptions" element={<GetProductList />} />
          <Route path="/my/subscriptions" element={<UserSubscriptionList />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route
            path="/payment/billing/register"
            element={<BillingRegisterPage />}
          />
          <Route
            path="/payment/billing/success"
            element={<BillingSuccessPage />}
          />

          <Route path="/community/notice" element={<ListNotice />} />
          <Route
            path="/community/notice/:communityId"
            element={<GetNotice />}
          />
          <Route path="/community/notice/add" element={<AddNotice />} />
          <Route
            path="/community/notice/update/:communityId"
            element={<UpdateNotice />}
          />

          <Route path="/community/faq" element={<ListFaq />} />
          <Route path="/community/faq/add" element={<AddFaq />} />

          <Route path="/community/inquiry" element={<Inquiry />} />
          <Route path="/community/inquiry/admin" element={<InquiryAdmin />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
