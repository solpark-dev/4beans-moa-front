import { useParams } from "react-router-dom";
import { useAdminUserDetailLogic } from "@/services/logic/admin/adminUserDetailLogic";

import { useMyPageStore } from "@/store/user/myPageStore";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    ListChecks,
} from "lucide-react";

export default function AdminUserDetailPage() {
    const { userId } = useParams();
    const {
        user,
        loading,
        error,
        formatDate,
        goBackList,
        goBlacklistAdd,
        goLoginHistory,
    } = useAdminUserDetailLogic(userId);

    const { isAdmin } = useMyPageStore();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-sm text-slate-500">회원 정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-sm text-red-500">{error}</p>
            </div>
        );
    }

    if (!user) return null;

    const googleConn = user.oauthConnections?.find(
        (c) => c.provider === "google" && !c.releaseDate
    );
    const kakaoConn = user.oauthConnections?.find(
        (c) => c.provider === "kakao" && !c.releaseDate
    );

    const shortId = user.userId?.split("@")[0] || user.userId;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                    <div className="max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
                            MoA 관리자 회원 상세 · ID: {shortId}
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
                            회원의 구독, 파티, 계정을
                            <br />
                            <span className="text-indigo-100">한 곳에서 관리합니다</span>
                        </h2>
                        <p className="text-sm sm:text-base text-indigo-50/90 leading-relaxed max-w-md mx-auto md:mx-0">
                            관리자 권한으로 해당 회원의 계정 정보를 확인하고 블랙리스트 등록,
                            로그인 이력 등을 조회할 수 있습니다.
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
                                        onClick={goBackList}
                                        variant="outline"
                                        className="h-8 px-3 text-xs border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg"
                                    >
                                        회원 목록
                                    </Button>
                                    <Button
                                        onClick={() => goLoginHistory()}
                                        variant="outline"
                                        className="h-8 px-3 text-xs border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 rounded-lg"
                                    >
                                        로그인 이력
                                    </Button>
                                    <Button
                                        onClick={goBlacklistAdd}
                                        className="h-8 px-3 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                    >
                                        블랙리스트 등록
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
                                    icon={<ListChecks className="w-4 h-4" />}
                                    label="로그인 이력"
                                    onClick={goLoginHistory}
                                    active
                                />
                                <MenuButton
                                    icon={<CreditCard className="w-4 h-4" />}
                                    label="구독·약정 관리"
                                    onClick={() =>
                                        window.location.assign(
                                            `/admin/subscription?user=${encodeURIComponent(
                                                user.userId
                                            )}`
                                        )
                                    }
                                />
                                <MenuButton
                                    icon={<Wallet className="w-4 h-4" />}
                                    label="결제/정산 내역"
                                    onClick={() =>
                                        window.location.assign(
                                            `/admin/financial-history?user=${encodeURIComponent(
                                                user.userId
                                            )}`
                                        )
                                    }
                                />
                            </CardContent>
                        </Card>

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
                                    label="회원 목록"
                                    onClick={goBackList}
                                />
                                <MenuButton
                                    icon={<UserX className="w-4 h-4" />}
                                    label="블랙리스트 관리"
                                    onClick={() => window.location.assign("/admin/blacklist")}
                                    variant="destructive"
                                />
                                <MenuButton
                                    icon={<LayoutDashboard className="w-4 h-4" />}
                                    label="관리자 대시보드"
                                    onClick={() => window.location.assign("/admin")}
                                />
                            </CardContent>
                        </Card>
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
                                    value={formatDate(user.regDate)}
                                />
                                <InfoRow
                                    label="마케팅 동의"
                                    value={user.marketing ? "수신 동의됨" : "미동의"}
                                    valueClass={
                                        user.marketing ? "text-emerald-600" : "text-slate-400"
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
                                        <SocialButton provider="google" isConnected={!!googleConn} />
                                        <SocialButton provider="kakao" isConnected={!!kakaoConn} />
                                    </div>
                                </div>
                            </InfoCard>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function MenuButton({ icon, label, onClick, variant = "default", active = false }) {
    const isDestructive = variant === "destructive";

    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className={`w-full justify-start h-11 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${active
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                } ${isDestructive ? "text-red-600 hover:text-red-700 hover:bg-red-50" : ""
                }`}
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

function SocialButton({ provider, isConnected }) {
    const isGoogle = provider === "google";

    const baseConnected =
        "flex-1 h-10 border text-xs font-bold transition-all duration-200 bg-red-50 border-red-300 text-red-600 hover:bg-red-100 rounded-xl";
    const baseGoogle =
        "flex-1 h-10 border text-xs font-bold transition-all duration-200 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 rounded-xl";
    const baseKakao =
        "flex-1 h-10 border text-xs font-bold transition-all duration-200 bg-[#FEE500] border-[#FCD34D] text-slate-900 hover:bg-[#FDE68A] rounded-xl";

    return (
        <Button
            type="button"
            variant="outline"
            className={isConnected ? baseConnected : isGoogle ? baseGoogle : baseKakao}
        >
            {isConnected
                ? `${provider.toUpperCase()} 연동됨`
                : `${provider.toUpperCase()} 미연동`}
        </Button>
    );
}
