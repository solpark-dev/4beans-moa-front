import { useEffect } from "react";
import { initMyPage, myPageHandlers } from "@/services/logic/myPageLogic";
import { useMyPageStore } from "@/store/user/myPageStore";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
    <div className="w-full flex flex-col items-center pt-20 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8">마이페이지</h2>

      <div className="flex w-full max-w-6xl gap-8 h-[720px]">
        {/* 사이드바 */}
        <aside className="w-56 bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-2">
          <SidebarButton label="구독·약정" onClick={handlers.goSubscription} />
          <SidebarButton label="내 파티 목록" onClick={handlers.goMyParties} />
          <SidebarButton label="비밀번호 변경" onClick={handlers.goChangePwd} />
          <SidebarButton label="내 지갑" onClick={handlers.goWallet} />

          {isAdmin && (
            <>
              <Separator className="my-2" />
              <SidebarButton
                label="회원 목록"
                onClick={handlers.goAdminUserList}
              />
              <SidebarButton
                label="블랙리스트 관리"
                variant="destructive"
                onClick={handlers.goAdminBlacklist}
              />
              <SidebarButton
                label="관리자 메인"
                onClick={handlers.goAdminHome}
              />
            </>
          )}
        </aside>

        {/* 오른쪽 패널 */}
        <Card className="flex-1 p-10 shadow-sm flex flex-col">
          {/* 상단 프로필 */}
          <div className="flex items-center gap-5 pb-6 border-b">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={
                  user.profileImage
                    ? user.profileImage.startsWith("/")
                      ? `https://localhost:8443${user.profileImage}`
                      : user.profileImage
                    : "https://static.thenounproject.com/png/363633-200.png"
                }
                alt="profile"
              />
            </Avatar>

            <div>
              <p className="text-xl font-semibold">{user.nickname}</p>
              <p className="text-gray-500 text-sm">{user.userId}</p>
            </div>
          </div>

          {/* 중단 정보 GRID */}
          <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm py-8 flex-1">
            <Info label="이메일" value={user.userId} />
            <Info label="닉네임" value={user.nickname} />
            <Info label="가입일자" value={handlers.formatDate(user.regDate)} />
            <Info
              label="마케팅 수신"
              value={user.marketing ? "수신동의" : "수신거부"}
            />
            <Info label="전화번호" value={user.phone} />
            <Info label="로그인 방식" value={user.loginProvider || "이메일"} />
          </div>

          {/* SNS */}
          <div className="flex gap-4 mb-5">
            <Button
              variant={googleConn ? "destructive" : "outline"}
              onClick={() =>
                googleConn
                  ? handlers.oauthRelease(googleConn.oauthId)
                  : handlers.oauthConnect("google")
              }
            >
              {googleConn ? "Google 연동 해제" : "Google로 시작하기"}
            </Button>

            <Button
              variant={kakaoConn ? "destructive" : "outline"}
              onClick={() =>
                kakaoConn
                  ? handlers.oauthRelease(kakaoConn.oauthId)
                  : handlers.oauthConnect("kakao")
              }
            >
              {kakaoConn ? "Kakao 연동 해제" : "Kakao로 시작하기"}
            </Button>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-3">
            <Button
              className="flex-1 h-10 text-base"
              onClick={handlers.goEditUser}
            >
              내정보 수정
            </Button>

            {isAdmin && (
              <Button
                className="flex-1 h-10 text-base"
                variant="destructive"
                onClick={() => handlers.goBlacklistAdd(user.userId)}
              >
                블랙리스트 등록
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SidebarButton({ label, onClick, variant }) {
  return (
    <Button
      variant={variant || "secondary"}
      className="w-full h-10 justify-start text-sm"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function Info({ label, value }) {
  return (
    <>
      <div className="text-gray-500">{label}</div>
      <div>{value}</div>
    </>
  );
}
