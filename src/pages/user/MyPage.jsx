import { useEffect } from "react";
import { initMyPage, myPageHandlers } from "@/services/logic/myPageLogic";
import { useMyPageStore } from "@/store/user/myPageStore";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  User, CreditCard, KeyRound, Wallet, LayoutDashboard, Users, UserX, 
  ShieldCheck, Zap, Layers 
} from "lucide-react";

export default function MyPage() {
  const { user, isAdmin } = useMyPageStore();
  const handlers = myPageHandlers();

  useEffect(() => {
    initMyPage();
  }, []);

  if (!user) return null;

  const googleConn = user.oauthConnections?.find(
    (c) => c.provider === "google" && !c.releaseDate
  );
  const kakaoConn = user.oauthConnections?.find(
    (c) => c.provider === "kakao" && !c.releaseDate
  );

  return (
    <div className="min-h-screen bg-[#030014] text-slate-200 font-sans selection:bg-[#FF00CC] selection:text-white pb-20">
      
      {/* 배경 효과 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FF00CC]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00CCFF]/10 rounded-full blur-[100px] -z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        
        {/* 헤더 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center rounded-full border border-[#FF00CC]/30 bg-[#FF00CC]/10 px-4 py-1.5 text-xs font-bold text-[#FF00CC] shadow-[0_0_15px_rgba(255,0,204,0.3)] mb-4">
              <span className="flex h-2 w-2 rounded-full bg-[#FF00CC] mr-2 shadow-[0_0_8px_#ff00cc] animate-pulse"></span>
              SYSTEM CONNECTED // ID: {user.userId.split("@")[0]}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
              MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00CC] to-[#00CCFF]">PAGE</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          
          {/* 사이드바 메뉴 */}
          <aside className="w-full lg:w-72 flex flex-col gap-4">
            <Card className="bg-[#0F172A]/60 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardContent className="p-4 flex flex-col gap-2">
                <MenuButton 
                  icon={<CreditCard className="w-4 h-4" />} 
                  label="구독·약정 관리" 
                  onClick={handlers.goSubscription} 
                  active 
                />
                <MenuButton 
                  icon={<Users className="w-4 h-4" />} 
                  label="내 파티 목록" 
                  onClick={handlers.goMyParties} 
                />
                <MenuButton 
                  icon={<KeyRound className="w-4 h-4" />} 
                  label="비밀번호 변경" 
                  onClick={handlers.goChangePwd} 
                />
                <MenuButton 
                  icon={<Wallet className="w-4 h-4" />} 
                  label="내 지갑" 
                  onClick={handlers.goWallet} 
                />
              </CardContent>
            </Card>

            {isAdmin && (
              <Card className="bg-[#0F172A]/60 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-bold text-[#00CCFF] uppercase tracking-wider flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Admin Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-col gap-2">
                  <MenuButton 
                    icon={<UserX className="w-4 h-4" />} 
                    label="회원 관리" 
                    onClick={handlers.goAdminUserList} 
                  />
                  <MenuButton 
                    icon={<UserX className="w-4 h-4" />} 
                    label="블랙리스트 관리" 
                    variant="destructive" 
                    onClick={handlers.goAdminBlacklist} 
                  />
                  <MenuButton 
                    icon={<LayoutDashboard className="w-4 h-4" />} 
                    label="관리자 대시보드" 
                    onClick={handlers.goAdminHome} 
                  />
                </CardContent>
              </Card>
            )}
          </aside>

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1 flex flex-col gap-6">
            
            {/* 프로필 카드 */}
            <Card className="bg-[#0F172A]/60 border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF00CC]/5 to-[#00CCFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                
                {/* 아바타 */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#FF00CC] to-[#00CCFF] rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                  <Avatar className="w-28 h-28 border-2 border-white/10 relative">
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
                    <AvatarFallback className="bg-slate-900 text-3xl font-bold text-white">
                      {user.nickname?.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-[#0F172A] p-1.5 rounded-full border border-white/10">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-pulse"></div>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2 w-full">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                    <h3 className="text-3xl font-bold text-white">{user.nickname}</h3>
                    {isAdmin && (
                      <Badge className="bg-[#00CCFF]/20 text-[#00CCFF] border-[#00CCFF]/50 hover:bg-[#00CCFF]/30">
                        ADMINISTRATOR
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-400 font-medium">{user.userId}</p>
                  
                  <div className="flex gap-3 justify-center md:justify-start mt-4">
                    <Button 
                      onClick={handlers.goEditUser}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/10 h-9"
                    >
                      내 정보 수정
                    </Button>
                    {isAdmin && (
                      <Button 
                        variant="destructive"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 h-9"
                        onClick={() => handlers.goBlacklistAdd(user.userId)}
                      >
                        블랙리스트 테스트
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 상세 정보 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 계정 정보 */}
              <InfoCard title="ACCOUNT INFO" icon={<User className="w-4 h-4" />}>
                <InfoRow label="이메일" value={user.userId} />
                <InfoRow label="닉네임" value={user.nickname} />
                <InfoRow label="가입일" value={handlers.formatDate(user.regDate)} />
                <InfoRow 
                  label="마케팅 동의" 
                  value={user.marketing ? "수신 동의됨" : "미동의"} 
                  valueClass={user.marketing ? "text-green-400" : "text-slate-500"}
                />
              </InfoCard>

              {/* 연결 정보 */}
              <InfoCard title="CONNECTION STATUS" icon={<Zap className="w-4 h-4" />}>
                <InfoRow label="휴대폰" value={user.phone} />
                <InfoRow label="로그인 방식" value={user.loginProvider || "EMAIL"} valueClass="uppercase font-bold text-[#FF00CC]" />
                
                <Separator className="bg-white/10 my-4" />
                
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase">Linked Accounts</p>
                  <div className="flex gap-3">
                    <SocialButton 
                      provider="google" 
                      isConnected={!!googleConn} 
                      onClick={() => googleConn ? handlers.oauthRelease(googleConn.oauthId) : handlers.oauthConnect("google")}
                    />
                    <SocialButton 
                      provider="kakao" 
                      isConnected={!!kakaoConn} 
                      onClick={() => kakaoConn ? handlers.oauthRelease(kakaoConn.oauthId) : handlers.oauthConnect("kakao")}
                    />
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

// ==========================================
// Sub Components (스타일링 적용됨)
// ==========================================

function MenuButton({ icon, label, onClick, variant = "default", active = false }) {
  const isDestructive = variant === "destructive";
  
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`
        w-full justify-start h-11 px-4 text-sm font-medium transition-all duration-300 rounded-lg group
        ${active 
          ? "bg-[#FF00CC]/10 text-[#FF00CC] border border-[#FF00CC]/30" 
          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"}
        ${isDestructive ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" : ""}
      `}
    >
      <span className={`mr-3 opacity-70 group-hover:opacity-100 transition-opacity ${active ? "opacity-100" : ""}`}>
        {icon}
      </span>
      {label}
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF00CC] shadow-[0_0_5px_#ff00cc]"></div>}
    </Button>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <Card className="bg-[#0F172A]/40 border-white/5 backdrop-blur-md shadow-lg h-full">
      <CardHeader className="pb-4 border-b border-white/5">
        <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value, valueClass = "text-white" }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className={`text-sm font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

function SocialButton({ provider, isConnected, onClick }) {
  const isGoogle = provider === "google";
  
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`
        flex-1 h-10 border text-xs font-bold transition-all duration-300
        ${isConnected 
          ? "bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500" 
          : isGoogle 
            ? "bg-white text-black border-white hover:bg-gray-200" 
            : "bg-[#FEE500] text-black border-[#FEE500] hover:bg-[#FDD835]"}
      `}
    >
      {isConnected ? `${provider.toUpperCase()} 해제` : `${provider.toUpperCase()} 연동`}
    </Button>
  );
}