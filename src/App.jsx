import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import RequireAuth from "@/routes/RequireAuth";
import { useGlobalLinkHandler } from "@/hooks/common/useGlobalLinkHandler";

import ProtectedRoute from "@/routes/ProtectedRoute";
import OAuthCallbackPage from "./pages/oauth/OAuthCallbackPage";
import PhoneConnectPage from "./pages/oauth/PhoneConnectPage";
import SocialRegisterPage from "@/pages/user/register/SocialRegisterPage";
import MainPage from "./pages/main/MainPage";
import PartyListPage from "./pages/party/PartyListPage";
import PartyCreatePage from "./pages/party/PartyCreatePage";
import PartyDetailPage from "./pages/party/PartyDetailPage";
import PartyListPageO from "./pages/party/PartyListPageO";
import PartyListPageZO3 from "./pages/party/PartyListPageZO3";

import AddUserPage from "./pages/user/register/AddUserPage";
import LoginPage from "./pages/user/login/LoginPage";
import FindIdPage from "./pages/user/findId/FindIdPage";
import ResetPwdPage from "./pages/user/resetPwd/ResetPwdPage";
import UpdatePwdPage from "./pages/user/resetPwd/UpdatePwdPage";
import DeleteUserPage from "./pages/user/register/DeleteUserPage";
import MyPage from "./pages/user/mypage/MyPage";
import EmailVerifiedPage from "./pages/user/register/EmailVerifiedPage";
import UpdateUserPage from "./pages/user/mypage/UpdateUserPage";
import FinancialHistoryPage from "./pages/user/FinancialHistoryPage";
import MyWalletPage from "./pages/user/MyWalletPage";
import BankVerificationPage from "./pages/account/BankVerificationPage";
import MyPartyListPage from "./pages/party/MyPartyListPage";
import AddBlacklistPage from "./pages/admin/AddBlacklistPage";
import AdminUserListPage from "@/pages/admin/AdminUserListPage";
import AdminUserDetailPage from "@/pages/admin/AdminUserDetailPage";
import AdminBlacklistDeletePage from "@/pages/admin/RemoveBlacklistPage";
import AdminLoginHistoryPage from "@/pages/admin/AdminLoginHistoryPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import ChartComparisonPage from "@/pages/admin/ChartComparisonPage";
import AdminAuthGuard from "@/pages/admin/components/AdminAuthGuard";

import GetProductList from "./pages/product/GetProductList";
import GetProduct from "./pages/product/GetProduct";

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
import BillingFailPage from "./pages/payment/BillingFailPage";

import ListNotice from "./pages/community/ListNotice";
import GetNotice from "./pages/community/GetNotice";
import AddNotice from "./pages/community/AddNotice";
import UpdateNotice from "./pages/community/UpdateNotice";
import ListFaq from "./pages/community/ListFaq";
import AddFaq from "./pages/community/AddFaq";
import Inquiry from "./pages/community/Inquiry";
import InquiryAdmin from "./pages/community/InquiryAdmin";

import ScrollToTop from "./components/common/ScrollToTop";
import PineappleEasterEgg from "./components/common/PineappleEasterEgg";
import FloatingButtonsContainer from "./components/common/FloatingButtonsContainer";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { themeConfig } from "./config/themeConfig";
import { NeoBackground } from "./components/common/neo";
import { SnowPlowProvider } from "./components/christmas/SnowPlow";

import PassRedirect from "@/pages/auth/PassRedirect";

import LandingPageA from "@/pages/landing/LandingPageA";
import LandingPageB from "@/pages/landing/LandingPageB";
import LandingPageC from "@/pages/landing/LandingPageC";
import LandingPageD from "@/pages/landing/LandingPageD";
import LandingPageE from "@/pages/landing/LandingPageE";
import LandingPageF from "@/pages/landing/LandingPageF";
import LandingPageG from "@/pages/landing/LandingPageG";
import LandingPageH from "@/pages/landing/LandingPageH";
import LandingPageI from "@/pages/landing/LandingPageI";
import LandingPageJ from "@/pages/landing/LandingPageJ";
import LandingPageK from "@/pages/landing/LandingPageK";
import LandingPageL from "@/pages/landing/LandingPageL";
import LandingPageM from "@/pages/landing/LandingPageM";
import LandingPageN from "@/pages/landing/LandingPageN";
import LandingPageO from "@/pages/landing/LandingPageO";
import LandingPageP from "@/pages/landing/LandingPageP";
import LandingPageQ from "@/pages/landing/LandingPageQ";
import LandingPageR from "@/pages/landing/LandingPageR";
import LandingPageS from "@/pages/landing/LandingPageS";
import LandingPageT from "@/pages/landing/LandingPageT";
import LandingPageU from "@/pages/landing/LandingPageU";
import LandingPageV from "@/pages/landing/LandingPageV";
import LandingPageW from "@/pages/landing/LandingPageW";
import LandingPageX from "@/pages/landing/LandingPageX";
import LandingPageY from "@/pages/landing/LandingPageY";
import LandingPageYsa01 from "@/pages/landing/LandingPageYsa01";
import LandingPageZ from "@/pages/landing/LandingPageZ";

import LandingPageZChat from "@/pages/landing/LandingPageZChat";
import LandingPageZCinematic from "@/pages/landing/LandingPageZCinematic";
import LandingPageZCollage from "@/pages/landing/LandingPageZCollage";
import LandingPageZGlassLight from "@/pages/landing/LandingPageZGlassLight";
import LandingPageZHyundai from "@/pages/landing/LandingPageZHyundai";
import LandingPageZLinear from "@/pages/landing/LandingPageZLinear";
import LandingPageZMemphis from "@/pages/landing/LandingPageZMemphis";
import LandingPageZO2 from "@/pages/landing/LandingPageZO2";
import LandingPageZO3 from "@/pages/landing/LandingPageZO3";
import LandingPageZParallax from "@/pages/landing/LandingPageZParallax";
import LandingPageZParticles from "@/pages/landing/LandingPageZParticles";
import LandingPageZPhysics from "@/pages/landing/LandingPageZPhysics";
import LandingPageZPortrait from "@/pages/landing/LandingPageZPortrait";
import LandingPageZPortraitV2 from "@/pages/landing/LandingPageZPortraitV2";
import LandingPageZQQ from "@/pages/landing/LandingPageZQQ";
import LandingPageZRetro from "@/pages/landing/LandingPageZRetro";
import LandingPageZRiso from "@/pages/landing/LandingPageZRiso";
import LandingPageZRiso2 from "@/pages/landing/LandingPageZRiso2";
import LandingPageZSolar from "@/pages/landing/LandingPageZSolar";
import LandingPageZSpatial from "@/pages/landing/LandingPageZSpatial";
import LandingPageZSwiss from "@/pages/landing/LandingPageZSwiss";

function AppContent() {
  useGlobalLinkHandler();
  const location = useLocation();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const currentTheme = themeConfig[theme] || themeConfig.pop;

  const [pineappleEnabled, setPineappleEnabled] = useState(false);

  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    const currentThemeConfig = themeConfig[theme] || themeConfig.pop;
    const cssVars = currentThemeConfig.cssVars;
    if (cssVars) {
      Object.entries(cssVars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        const themeMap = {
          Digit1: "pop",
          Digit2: "classic",
          Digit3: "dark",
          Digit4: "christmas",
        };
        const newTheme = themeMap[e.code];
        if (newTheme) {
          e.preventDefault();
          setTheme(newTheme);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setTheme]);

  const showEasterEgg =
    user && (user.userId === "usertest1" || user.userId === "admintest");

  const getBgClass = () => {
    switch (theme) {
      case "dark":
        return "bg-[#0B1120] text-white";
      case "christmas":
        return "bg-transparent text-black";
      case "pop":
        return "bg-transparent text-black";
      default:
        return "bg-transparent text-black";
    }
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col transition-colors duration-300 ${getBgClass()}`}
    >
      <NeoBackground />
      <ScrollToTop />
      {showEasterEgg && pineappleEnabled && (
        <PineappleEasterEgg showToggle={false} />
      )}
      <FloatingButtonsContainer
        showPineapple={showEasterEgg}
        pineappleEnabled={pineappleEnabled}
        setPineappleEnabled={setPineappleEnabled}
      />

      <Header />

      <main
        className="flex-1 transition-all duration-500 ease-out"
        style={{ paddingTop: "5rem" }}
      >
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/party" element={<PartyListPage />} />
          <Route path="/party/create" element={<PartyCreatePage />} />
          <Route path="/party/:id" element={<PartyDetailPage />} />
          <Route path="/party-test/o" element={<PartyListPageO />} />
          <Route path="/party-test/zo3" element={<PartyListPageZO3 />} />

          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/oauth/phone-connect" element={<PhoneConnectPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<AddUserPage />} />
          <Route path="/find-email" element={<FindIdPage />} />
          <Route path="/register/social" element={<SocialRegisterPage />} />
          <Route path="/reset-password" element={<ResetPwdPage />} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />

          <Route path="/auth/pass/redirect" element={<PassRedirect />} />

          <Route
            path="/mypage"
            element={
              <RequireAuth>
                <MyPage />
              </RequireAuth>
            }
          />

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
            path="/mypage/wallet"
            element={<ProtectedRoute element={<MyWalletPage />} />}
          />
          <Route
            path="/user/account-register"
            element={<ProtectedRoute element={<BankVerificationPage />} />}
          />
          <Route
            path="/user/account-verify"
            element={<ProtectedRoute element={<BankVerificationPage />} />}
          />
          <Route
            path="/account/verify"
            element={<ProtectedRoute element={<BankVerificationPage />} />}
          />
          <Route
            path="/my-parties"
            element={<ProtectedRoute element={<MyPartyListPage />} />}
          />
          <Route
            path="/mypage/edit"
            element={<ProtectedRoute element={<UpdateUserPage />} />}
          />

          <Route
            path="/admin/blacklist/add"
            element={
              <AdminAuthGuard>
                <AddBlacklistPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminAuthGuard>
                <AdminUserListPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminAuthGuard>
                <AdminDashboardPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/chart-comparison"
            element={
              <AdminAuthGuard>
                <ChartComparisonPage />
              </AdminAuthGuard>
            }
          />
          <Route path="/admin/users" element={<AdminUserListPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route
            path="/admin/chart-comparison"
            element={<ChartComparisonPage />}
          />
          <Route
            path="/admin/users/:userId"
            element={
              <AdminAuthGuard>
                <AdminUserDetailPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/blacklist/delete"
            element={
              <AdminAuthGuard>
                <AdminBlacklistDeletePage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/users/:userId/login-history"
            element={
              <AdminAuthGuard>
                <AdminLoginHistoryPage />
              </AdminAuthGuard>
            }
          />

          <Route path="/product" element={<GetProductList />} />
          <Route path="/product/:id" element={<GetProduct />} />
          <Route
            path="/product/:id/delete"
            element={<ProtectedRoute element={<DeleteProduct />} />}
          />

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
          <Route path="/payment/billing/fail" element={<BillingFailPage />} />

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

          <Route path="/landing/a" element={<LandingPageA />} />
          <Route path="/landing/b" element={<LandingPageB />} />
          <Route path="/landing/c" element={<LandingPageC />} />
          <Route path="/landing/d" element={<LandingPageD />} />
          <Route path="/landing/e" element={<LandingPageE />} />
          <Route path="/landing/f" element={<LandingPageF />} />
          <Route path="/landing/g" element={<LandingPageG />} />
          <Route path="/landing/h" element={<LandingPageH />} />
          <Route path="/landing/i" element={<LandingPageI />} />
          <Route path="/landing/j" element={<LandingPageJ />} />
          <Route path="/landing/k" element={<LandingPageK />} />
          <Route path="/landing/l" element={<LandingPageL />} />
          <Route path="/landing/m" element={<LandingPageM />} />
          <Route path="/landing/n" element={<LandingPageN />} />
          <Route path="/landing/o" element={<LandingPageO />} />
          <Route path="/landing/p" element={<LandingPageP />} />
          <Route path="/landing/q" element={<LandingPageQ />} />
          <Route path="/landing/r" element={<LandingPageR />} />
          <Route path="/landing/s" element={<LandingPageS />} />
          <Route path="/landing/t" element={<LandingPageT />} />
          <Route path="/landing/u" element={<LandingPageU />} />
          <Route path="/landing/v" element={<LandingPageV />} />
          <Route path="/landing/w" element={<LandingPageW />} />
          <Route path="/landing/x" element={<LandingPageX />} />
          <Route path="/landing/y" element={<LandingPageY />} />
          <Route path="/landing/ysa01" element={<LandingPageYsa01 />} />
          <Route path="/landing/z" element={<LandingPageZ />} />

          {/* Landing Z Variants */}
          <Route path="/landing/z/chat" element={<LandingPageZChat />} />
          <Route
            path="/landing/z/cinematic"
            element={<LandingPageZCinematic />}
          />
          <Route path="/landing/z/collage" element={<LandingPageZCollage />} />
          <Route
            path="/landing/z/glass-light"
            element={<LandingPageZGlassLight />}
          />
          <Route path="/landing/z/hyundai" element={<LandingPageZHyundai />} />
          <Route path="/landing/z/linear" element={<LandingPageZLinear />} />
          <Route path="/landing/z/memphis" element={<LandingPageZMemphis />} />
          <Route path="/landing/z/o2" element={<LandingPageZO2 />} />
          <Route path="/landing/z/o3" element={<LandingPageZO3 />} />
          <Route
            path="/landing/z/parallax"
            element={<LandingPageZParallax />}
          />
          <Route
            path="/landing/z/particles"
            element={<LandingPageZParticles />}
          />
          <Route path="/landing/z/physics" element={<LandingPageZPhysics />} />
          <Route
            path="/landing/z/portrait"
            element={<LandingPageZPortrait />}
          />
          <Route
            path="/landing/z/portrait-v2"
            element={<LandingPageZPortraitV2 />}
          />
          <Route path="/landing/z/oq" element={<LandingPageZQQ />} />
          <Route path="/landing/z/retro" element={<LandingPageZRetro />} />
          <Route path="/landing/z/riso" element={<LandingPageZRiso />} />
          <Route path="/landing/z/riso2" element={<LandingPageZRiso2 />} />
          <Route path="/landing/z/solar" element={<LandingPageZSolar />} />
          <Route path="/landing/z/spatial" element={<LandingPageZSpatial />} />
          <Route path="/landing/z/swiss" element={<LandingPageZSwiss />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SnowPlowProvider>
      <AppContent />
    </SnowPlowProvider>
  );
}
