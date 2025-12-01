import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { initSignupPage } from "@/services/logic/addUserPageLogic";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddUserPage() {
  const [params] = useSearchParams();
  const provider = params.get("provider");
  const providerUserId = params.get("providerUserId");

  const isSocialSignup = provider && providerUserId;

  useEffect(() => {
    initSignupPage();
  }, []);

  return (
    <div className="flex flex-col items-center pt-28 pb-20 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">회원가입</h2>
      <p className="text-gray-500 mb-10 text-sm">
        아래 정보를 정확히 입력해 주세요.
      </p>

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">기본 정보 입력</CardTitle>
          <CardDescription>
            {isSocialSignup
              ? "카카오 계정으로 회원가입을 진행합니다."
              : "이메일, 비밀번호, 휴대폰 번호를 입력해주세요."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* 소셜 로그인 */}
          {isSocialSignup && (
            <>
              <div className="p-3 bg-yellow-50 border rounded text-sm">
                <p className="font-semibold text-yellow-700">
                  카카오 소셜 회원가입
                </p>
                <p className="text-yellow-600 mt-1">
                  이메일/비밀번호 입력은 생략됩니다.
                </p>
              </div>

              <input type="hidden" id="signupProvider" value={provider || ""} />
              <input
                type="hidden"
                id="signupProviderUserId"
                value={providerUserId || ""}
              />
            </>
          )}

          {/* 일반 회원가입 */}
          {!isSocialSignup && (
            <>
              {/* 이메일 */}
              <div className="space-y-1">
                <Label htmlFor="signupEmail">이메일(아이디)</Label>
                <Input id="signupEmail" placeholder="예: moa@email.com" />
                <p id="msgEmail" className="text-xs mt-1"></p>

                <p className="text-xs text-gray-400 mt-1">
                  회원가입이 완료되면 해당 이메일로 인증 메일이 발송됩니다.
                </p>
              </div>

              {/* 비밀번호 */}
              <div className="space-y-1">
                <Label htmlFor="signupPassword">비밀번호</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="8~20자 / 영문+숫자 조합"
                />
                <p id="msgPassword" className="text-xs mt-1"></p>
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-1">
                <Label htmlFor="signupPasswordCheck">비밀번호 확인</Label>
                <Input
                  id="signupPasswordCheck"
                  type="password"
                  placeholder="다시 입력"
                />
                <p id="msgPasswordCheck" className="text-xs mt-1"></p>
              </div>
            </>
          )}

          {/* 닉네임 */}
          <div className="space-y-1">
            <Label htmlFor="signupNickname">닉네임</Label>
            <Input id="signupNickname" placeholder="닉네임 입력" />
            <p id="msgNickname" className="text-xs mt-1"></p>
          </div>

          {/* 휴대폰 + PASS 인증 */}
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="signupPhone">휴대폰 번호</Label>
              <Input id="signupPhone" placeholder="숫자만 입력" readOnly />
              <p id="msgPhone" className="text-xs mt-1"></p>
            </div>

            <Button
              id="btnPhoneVerify"
              type="button"
              className="cursor-pointer"
            >
              본인인증
            </Button>
          </div>

          {/* 프로필 이미지, 썸네일 확대 */}
          <div className="space-y-2">
            <Label>프로필 이미지</Label>

            <div className="flex items-center gap-4 mt-1">
              <div className="w-28 h-28 border rounded-lg bg-gray-100 overflow-hidden">
                <img
                  id="signupProfilePreview"
                  className="hidden w-full h-full object-cover"
                />
              </div>

              <Input id="signupProfileImage" type="file" accept="image/*" />
            </div>
          </div>

          {/* 마케팅 동의 */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                id="agreeMarketing"
                type="checkbox"
                className="cursor-pointer"
              />
              마케팅 정보 수신 동의 (선택)
            </label>
          </div>
        </CardContent>

        <CardFooter>
          <Button id="btnSignup" className="w-full cursor-pointer">
            회원가입
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
