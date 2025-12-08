import React from "react";
import { useMyPage } from "@/hooks/user/useMyPage";
import { useLoginHistory } from "@/hooks/user/useLoginHistory";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  User,
  CreditCard,
  KeyRound,
  Wallet,
  LayoutDashboard,
  Users,
  UserX,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { QRCodeSVG } from "qrcode.react";
import { useOtpStore } from "@/store/user/otpStore";

export default function MyPage() {
  const { state, actions } = useMyPage();
  const loginHistory = useLoginHistory(10);

  const { user, isAdmin, shortId, marketingAgreed, googleConn, kakaoConn } =
    state;
  const otp = {
    enabled: useOtpStore((s) => s.enabled),
    modalOpen: useOtpStore((s) => s.modalOpen),
    mode: useOtpStore((s) => s.mode),
    qrUrl: useOtpStore((s) => s.qrUrl),
    code: useOtpStore((s) => s.code),
    loading: useOtpStore((s) => s.loading),
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
              MoA 계정 관리 센터 · ID: {shortId}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
              나의 구독, 파티, 계정까지
              <br />
              <span className="text-indigo-100">한 곳에서 관리해요</span>
            </h2>
            <p className="text-sm sm:text-base text-indigo-50/90 leading-relaxed max-w-md mx-auto md:mx-0">
              프로필 정보, 비밀번호, 소셜 연동과 구독 파티 상태를 이곳에서
              한눈에 확인하고 관리할 수 있어요.
            </p>
          </div>

          <Card className="bg-white/95 border border-indigo-100 shadow-xl rounded-3xl w-full max-w-md">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="relative">
                <Avatar className="w-20 h-20 border border-slate-200 bg-slate-100">
                  <AvatarImage
                    src={
                      user.profileImage
                        ? user.profileImage.startsWith("http")
                          ? user.profileImage
                          : `https://localhost:8443${user.profileImage}`
                        : ""
                    }
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-200 text-2xl font-bold text-slate-700">
                    {user.nickname?.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border border-slate-200">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg md:text-xl font-bold text-slate-900">
                    {user.nickname}
                  </p>
                  {isAdmin && (
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                      ADMINISTRATOR
                    </Badge>
                  )}
                  <Badge className="bg-white text-indigo-600 border border-indigo-200 text-[10px]">
                    MEMBER
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{user.userId}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    onClick={actions.goEditUser}
                    className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    내 정보 수정
                  </Button>
                  <Button
                    onClick={actions.goChangePwd}
                    variant="outline"
                    className="h-8 px-3 text-xs border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 rounded-lg"
                  >
                    비밀번호 변경
                  </Button>
                  <Button
                    onClick={actions.goDeleteUser}
                    variant="outline"
                    className="h-8 px-3 text-xs border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg"
                  >
                    회원 탈퇴
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="flex flex-col lg:flex-row gap-8 mt-8 min-h-[520px]">
          <aside className="w-full lg:w-72 flex flex-col gap-4">
            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em] flex items-center gap-1.5">
                  <LayoutDashboard className="w-3 h-3" />
                  Account Menu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-col gap-2">
                <MenuButton
                  icon={<CreditCard className="w-4 h-4" />}
                  label="구독·약정 관리"
                  onClick={actions.goSubscription}
                  active
                />
                <MenuButton
                  icon={<Users className="w-4 h-4" />}
                  label="내 파티 목록"
                  onClick={actions.goMyParties}
                />
                <MenuButton
                  icon={<KeyRound className="w-4 h-4" />}
                  label="비밀번호 변경"
                  onClick={actions.goChangePwd}
                />
                <MenuButton
                  icon={<Wallet className="w-4 h-4" />}
                  label="내 지갑"
                  onClick={actions.goWallet}
                />
              </CardContent>
            </Card>

            {isAdmin && (
              <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-bold text-amber-700 uppercase tracking-[0.18em] flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" />
                    Admin Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-col gap-2">
                  <MenuButton
                    icon={<User className="w-4 h-4" />}
                    label="회원 관리"
                    onClick={actions.goAdminUserList}
                  />
                  <MenuButton
                    icon={<UserX className="w-4 h-4" />}
                    label="블랙리스트 관리"
                    variant="destructive"
                    onClick={actions.goAdminBlacklist}
                  />
                  <MenuButton
                    icon={<LayoutDashboard className="w-4 h-4" />}
                    label="관리자 대시보드"
                    onClick={actions.goAdminHome}
                  />
                </CardContent>
              </Card>
            )}
          </aside>

          <main className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                title="ACCOUNT INFO"
                icon={<User className="w-4 h-4" />}
              >
                <InfoRow label="이메일" value={user.userId} />
                <InfoRow label="닉네임" value={user.nickname} />
                <InfoRow
                  label="가입일"
                  value={actions.formatDate(user.regDate)}
                />
                <InfoRow
                  label="마케팅 동의"
                  value={marketingAgreed ? "수신 동의됨" : "미동의"}
                  valueClass={
                    marketingAgreed ? "text-emerald-600" : "text-slate-400"
                  }
                />
              </InfoCard>

              <InfoCard
                title="CONNECTION STATUS"
                icon={<Zap className="w-4 h-4" />}
              >
                <InfoRow label="휴대폰" value={user.phone} />
                <InfoRow
                  label="로그인 방식"
                  value={user.loginProvider || "EMAIL"}
                  valueClass="uppercase font-semibold text-indigo-700"
                />

                <Separator className="bg-slate-200 my-4" />

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
                    Linked Accounts
                  </p>
                  <div className="flex gap-3">
                    <SocialButton
                      provider="google"
                      isConnected={!!googleConn}
                      onClick={actions.handleGoogleClick}
                    />
                    <SocialButton
                      provider="kakao"
                      isConnected={!!kakaoConn}
                      onClick={actions.handleKakaoClick}
                    />
                  </div>
                </div>

                <Separator className="bg-slate-200 my-4" />

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
                    Security · Google OTP
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        otp.enabled
                          ? "text-sm font-semibold text-emerald-600"
                          : "text-sm font-semibold text-slate-400"
                      }
                    >
                      {otp.enabled ? "OTP 사용중" : "OTP 미사용"}
                    </span>
                    <div className="flex gap-2">
                      {!otp.enabled && (
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                          onClick={actions.otp.openSetup}
                        >
                          OTP 설정
                        </Button>
                      )}

                      {otp.enabled && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg"
                          onClick={() => {
                            actions.otp.prepareDisable();
                          }}
                        >
                          OTP 해제
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>

            <LoginHistoryCard loginHistory={loginHistory} />
          </main>
        </div>
      </div>

      <Dialog open={otp.modalOpen} onOpenChange={actions.handleOtpModalChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {otp.mode === "disable" ? "Google OTP 해제" : "Google OTP 설정"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {otp.mode === "enable" && otp.qrUrl && (
              <div className="flex justify-center">
                <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                  <QRCodeSVG value={otp.qrUrl} size={180} />
                </div>
              </div>
            )}
            <p className="text-sm text-slate-600 leading-relaxed">
              {otp.mode === "disable"
                ? "등록된 Google OTP를 해제하려면 앱에서 생성된 6자리 코드를 입력해주세요."
                : "Google Authenticator 앱을 열고 QR 코드를 스캔한 뒤, 생성된 6자리 코드를 아래에 입력해주세요."}
            </p>
            <Input
              type="text"
              value={otp.code}
              maxLength={6}
              inputMode="numeric"
              className="text-center tracking-[0.4em] text-lg"
              onChange={(e) => actions.otp.changeCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  actions.otp.confirmOtp();
                }
              }}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={actions.otp.closeModal}
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={actions.otp.confirmOtp}
                disabled={otp.loading || otp.code.length !== 6}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                인증 완료
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  variant = "default",
  active = false,
}) {
  const isDestructive = variant === "destructive";
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`
        w-full justify-start h-11 px-4 text-sm font-medium rounded-lg
        transition-all duration-200
        ${
          active
            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
        }
        ${
          isDestructive ? "text-red-600 hover:text-red-700 hover:bg-red-50" : ""
        }
      `}
    >
      <span className="mr-3 opacity-80">{icon}</span>
      {label}
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
      )}
    </Button>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm h-full rounded-2xl">
      <CardHeader className="pb-4 border-b border-slate-200">
        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em] flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">{children}</CardContent>
    </Card>
  );
}

function InfoRow({ label, value, valueClass = "text-slate-900" }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function SocialButton({ provider, isConnected, onClick }) {
  const isGoogle = provider === "google";
  const baseConnected =
    "flex-1 h-10 border text-xs font-bold transition-all duration-200 bg-red-50 border-red-300 text-red-600 hover:bg-red-100 rounded-xl";
  const baseGoogle =
    "flex-1 h-10 border text-xs font-bold transition-all duration-200 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 rounded-xl";
  const baseKakao =
    "flex-1 h-10 border text-xs font-bold transition-all duration-200 bg-[#FEE500] border-[#FCD34D] text-slate-900 hover:bg[#FDE68A] rounded-xl";

  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={
        isConnected ? baseConnected : isGoogle ? baseGoogle : baseKakao
      }
    >
      {isConnected
        ? `${provider.toUpperCase()} 해제`
        : `${provider.toUpperCase()} 연동`}
    </Button>
  );
}

function LoginHistoryCard({ loginHistory }) {
  const {
    state: { items, page, pages, pageCount, loading, totalCount },
    actions: { goFirst, goPrev, goPage, goNextBlock, goLast },
  } = loginHistory;

  return (
    <InfoCard title="LOGIN HISTORY" icon={<KeyRound className="w-4 h-4" />}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500">
          최근 로그인 이력 {totalCount}건
        </span>
      </div>

      {loading && (
        <div className="py-8 text-center text-sm text-slate-500">
          불러오는 중...
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="py-8 text-center text-sm text-slate-400">
          아직 로그인 이력이 없습니다.
        </div>
      )}

      {!loading && items.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2 px-2 text-left font-semibold text-slate-600">
                    일시
                  </th>
                  <th className="py-2 px-2 text-left font-semibold text-slate-600">
                    결과
                  </th>
                  <th className="py-2 px-2 text-left font-semibold text-slate-600">
                    IP
                  </th>
                  <th className="py-2 px-2 text-left font-semibold text-slate-600">
                    타입
                  </th>
                  <th className="py-2 px-2 text-left font-semibold text-slate-600">
                    User-Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={`${item.loginAt}-${idx}`}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-2 px-2 text-slate-800 whitespace-nowrap">
                      {item.loginAtFormatted}
                    </td>
                    <td
                      className={`py-2 px-2 font-semibold ${
                        item.success ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {item.successText}
                    </td>
                    <td className="py-2 px-2 text-slate-700 whitespace-nowrap">
                      {item.loginIp || "-"}
                    </td>
                    <td className="py-2 px-2 text-slate-700 whitespace-nowrap">
                      {item.loginType || "-"}
                    </td>
                    <td className="py-2 px-2 text-slate-500 max-w-[220px] truncate">
                      {item.userAgent || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 text-xs"
              onClick={goFirst}
              disabled={page <= 1}
            >
              {"<<"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 text-xs"
              onClick={goPrev}
              disabled={page <= 1}
            >
              {"<"}
            </Button>
            {pages.map((p) => (
              <Button
                key={p}
                type="button"
                variant={p === page ? "default" : "outline"}
                className={`h-8 min-w-[2rem] text-xs ${
                  p === page ? "bg-indigo-600 text-white" : "text-slate-700"
                }`}
                onClick={() => goPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 text-xs"
              onClick={goNextBlock}
              disabled={page >= pageCount}
            >
              {">"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 text-xs"
              onClick={goLast}
              disabled={page >= pageCount}
            >
              {">>"}
            </Button>
          </div>
        </>
      )}
    </InfoCard>
  );
}
