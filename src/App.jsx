import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
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

import LandingTestPage from "./pages/landing/LandingTestPage";
import LandingPageA from "./pages/landing/LandingPageA";
import LandingPageB from "./pages/landing/LandingPageB";
import LandingPageC from "./pages/landing/LandingPageC";
import LandingPageD from "./pages/landing/LandingPageD";
import LandingPageE from "./pages/landing/LandingPageE";
import LandingPageF from "./pages/landing/LandingPageF";
import LandingPageG from "./pages/landing/LandingPageG";
import LandingPageH from "./pages/landing/LandingPageH";
import LandingPageI from "./pages/landing/LandingPageI";
import LandingPageJ from "./pages/landing/LandingPageJ";
import LandingPageK from "./pages/landing/LandingPageK";
import LandingPageL from "./pages/landing/LandingPageL";
import LandingPageM from "./pages/landing/LandingPageM";
import LandingPageN from "./pages/landing/LandingPageN";
import LandingPageO from "./pages/landing/LandingPageO";
import LandingPageP from "./pages/landing/LandingPageP";
import LandingPageQ from "./pages/landing/LandingPageQ";
import LandingPageR from "./pages/landing/LandingPageR";
import LandingPageS from "./pages/landing/LandingPageS";
import LandingPageT from "./pages/landing/LandingPageT";
import LandingPageU from "./pages/landing/LandingPageU";
import LandingPageV from "./pages/landing/LandingPageV";
import LandingPageW from "./pages/landing/LandingPageW";
import LandingPageX from "./pages/landing/LandingPageX";
import LandingPageY from "./pages/landing/LandingPageY";
import LandingPageZ from "./pages/landing/LandingPageZ";
import LandingPageZHyundai from "./pages/landing/LandingPageZHyundai";
import LandingPageZO2 from "./pages/landing/LandingPageZO2";
import LandingPageZO3 from "./pages/landing/LandingPageZO3";
import LandingPageZMemphis from "./pages/landing/LandingPageZMemphis";
import LandingPageZCollage from "./pages/landing/LandingPageZCollage";
import LandingPageZRiso from "./pages/landing/LandingPageZRiso";
import LandingPageZRiso2 from "./pages/landing/LandingPageZRiso2";
import LandingPageZParticles from "./pages/landing/LandingPageZParticles";
import LandingPageZPhysics from "./pages/landing/LandingPageZPhysics";
import LandingPageZQQ from "./pages/landing/LandingPageZQQ";
import LandingPageZRetro from "./pages/landing/LandingPageZRetro";
import LandingPageZSwiss from "./pages/landing/LandingPageZSwiss";
import LandingPageZCinematic from "./pages/landing/LandingPageZCinematic";
import LandingPageZSolar from "./pages/landing/LandingPageZSolar";
import LandingPageZSpatial from "./pages/landing/LandingPageZSpatial";
import LandingPageZChat from "./pages/landing/LandingPageZChat";
import LandingPageZLinear from "./pages/landing/LandingPageZLinear";
import LandingPageZGlassLight from "./pages/landing/LandingPageZGlassLight";
import LandingPageZParallax from "./pages/landing/LandingPageZParallax";
import LandingPageZPortrait from "./pages/landing/LandingPageZPortrait";
import LandingPageZPortraitV2 from "./pages/landing/LandingPageZPortraitV2";
import LandingPageYSa01 from "./pages/landing/LandingPageYSa01";

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
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { ThemeSwitcher, themeConfig } from "./config/themeConfig";
import { NeoBackground } from "./components/common/neo";

export default function App() {
  useGlobalLinkHandler();
  const location = useLocation();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const currentTheme = themeConfig[theme] || themeConfig.pop;

  // Check if current route is admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  // Header visibility state for admin pages
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const idleTimerRef = useRef(null);

  // Scroll up to show, auto-hide after 5s idle
  useEffect(() => {
    if (!isAdminPage) {
      setIsHeaderHidden(false);
      return;
    }

    // Start hidden on admin pages
    setIsHeaderHidden(true);
    lastScrollYRef.current = window.scrollY;

    const startIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        setIsHeaderHidden(true);
      }, 5000);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      // Scrolling UP - show header
      if (currentScrollY < lastScrollY) {
        setIsHeaderHidden(false);
        startIdleTimer();
      }
      // Scrolling DOWN - hide header
      else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHeaderHidden(true);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isAdminPage, location.pathname]);

  // CSS Variables Injection
  useEffect(() => {
    const currentThemeConfig = themeConfig[theme] || themeConfig.pop;
    const cssVars = currentThemeConfig.cssVars;
    if (cssVars) {
      Object.entries(cssVars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [theme]);

  // Easter egg for specific test accounts
  const showEasterEgg =
    user && (user.userId === "usertest1" || user.userId === "admintest");

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col transition-colors duration-300 bg-theme-bg text-theme-text`}
    >
      <NeoBackground />
      <ScrollToTop />
      {showEasterEgg && <PineappleEasterEgg />}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Header with slide animation for admin pages */}
      {isAdminPage ? (
        <motion.div
          initial={false}
          animate={{
            y: isHeaderHidden ? "-100%" : "0%",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="fixed top-0 left-0 right-0 z-[200]"
        >
          <Header />
        </motion.div>
      ) : (
        <Header />
      )}

      <main
        className="flex-1 transition-all duration-500 ease-out"
        style={{ paddingTop: isAdminPage && isHeaderHidden ? '1rem' : '5rem' }}
      >
        <Routes>
          {/* Main/Party */}
          <Route path="/" element={<MainPage />} />
          <Route path="/party" element={<PartyListPage />} />
          <Route path="/party/create" element={<PartyCreatePage />} />
          <Route path="/party/:id" element={<PartyDetailPage />} />
          <Route path="/party-test/o" element={<PartyListPageO />} />
          <Route path="/party-test/zo3" element={<PartyListPageZO3 />} />

          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/oauth/phone-connect" element={<PhoneConnectPage />} />
          {/* User pages (Public) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<AddUserPage />} />
          <Route path="/find-email" element={<FindIdPage />} />
          <Route path="/register/social" element={<SocialRegisterPage />} />
          <Route path="/reset-password" element={<ResetPwdPage />} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />
          <Route
            path="/user/register/social"
            element={<SocialRegisterPage />}
          />

          {/* User pages (Private - ProtectedRoute) */}
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
          {/* Complex conditional rendering handled by ProtectedRoute */}
          <Route
            path="/mypage/edit"
            element={<ProtectedRoute element={<UpdateUserPage />} />}
          />
          <Route
            path="/admin/blacklist/add"
            element={<AdminAuthGuard><AddBlacklistPage /></AdminAuthGuard>}
          />
          <Route path="/admin/users" element={<AdminAuthGuard><AdminUserListPage /></AdminAuthGuard>} />
          <Route path="/admin/dashboard" element={<AdminAuthGuard><AdminDashboardPage /></AdminAuthGuard>} />
          <Route path="/admin/chart-comparison" element={<AdminAuthGuard><ChartComparisonPage /></AdminAuthGuard>} />
          <Route
            path="/admin/users/:userId"
            element={<AdminAuthGuard><AdminUserDetailPage /></AdminAuthGuard>}
          />
          <Route
            path="/admin/blacklist/delete"
            element={<AdminAuthGuard><AdminBlacklistDeletePage /></AdminAuthGuard>}
          />
          <Route
            path="/admin/users/:userId/login-history"
            element={<AdminAuthGuard><AdminLoginHistoryPage /></AdminAuthGuard>}
          />
          <Route path="/product" element={<GetProductList />} />
          <Route path="/product/:id" element={<GetProduct />} />

          <Route
            path="/product/:id/delete"
            element={<ProtectedRoute element={<DeleteProduct />} />}
          // TODO: Add role check for ADMIN
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
          {/* Support/Community & payments */}
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

          <Route path="/landing-test" element={<LandingTestPage />} />
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
          <Route path="/landing/z" element={<LandingPageZ />} />
          <Route path="/landing/hyundai" element={<LandingPageZHyundai />} />
          <Route path="/landing/o2" element={<LandingPageZO2 />} />
          <Route path="/landing/o3" element={<LandingPageZO3 />} />
          <Route path="/landing/memphis" element={<LandingPageZMemphis />} />
          <Route path="/landing/collage" element={<LandingPageZCollage />} />
          <Route path="/landing/riso" element={<LandingPageZRiso />} />
          <Route path="/landing/riso2" element={<LandingPageZRiso2 />} />
          <Route
            path="/landing/particles"
            element={<LandingPageZParticles />}
          />
          <Route path="/landing/physics" element={<LandingPageZPhysics />} />
          <Route path="/landing/qq" element={<LandingPageZQQ />} />
          <Route path="/landing/swiss" element={<LandingPageZSwiss />} />
          <Route path="/landing/retro" element={<LandingPageZRetro />} />
          <Route
            path="/landing/cinematic"
            element={<LandingPageZCinematic />}
          />
          <Route path="/landing/solar" element={<LandingPageZSolar />} />
          <Route path="/landing/spatial" element={<LandingPageZSpatial />} />
          <Route path="/landing/chat" element={<LandingPageZChat />} />
          <Route path="/landing/linear" element={<LandingPageZLinear />} />
          <Route
            path="/landing/glass-light"
            element={<LandingPageZGlassLight />}
          />
          <Route path="/landing/parallax" element={<LandingPageZParallax />} />
          <Route path="/landing/portrait" element={<LandingPageZPortrait />} />
          <Route path="/landing/portrait-v2" element={<LandingPageZPortraitV2 />} />
          <Route path="/landing/ysa01" element={<LandingPageYSa01 />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}






