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

import { useSignupStore } from "@/store/user/signupStore";

export default function AddUserPage() {
  const [params] = useSearchParams();
  const provider = params.get("provider");
  const providerUserId = params.get("providerUserId");
  const isSocialSignup = provider && providerUserId;

  const { setField } = useSignupStore();

  useEffect(() => {
    initSignupPage();
  }, []);

  return (
    <div className="w-full pb-20 bg-slate-50 text-slate-900">
      <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* 왼쪽 텍스트 영역 – 메인 페이지 톤 맞춤 */}
          <div className="text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
              MoA 신규 멤버 등록 · 구독 파티 합류 준비
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3 drop-shadow-md">
              MoA 회원가입으로
              <br />
              <span className="text-indigo-100">구독도 같이 나누자</span>
            </h2>
            <p className="text-sm sm:text-base text-indigo-50/90 max-w-md mx-auto lg:mx-0 leading-relaxed">
              {isSocialSignup
                ? "카카오 계정과 연동된 정보로, 필수 입력은 최소화하고 빠르게 가입할 수 있어요."
                : "이메일, 비밀번호, 휴대폰 번호만 정확히 입력하면 바로 파티에 합류할 수 있어요."}
            </p>
          </div>

          {/* 오른쪽 카드 – 메인 Feature 카드 느낌 */}
          <div className="w-full max-w-xl">
            <Card className="w-full bg-white border border-gray-100 shadow-2xl rounded-3xl">
              <CardHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-gray-900">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-bold">
                    01
                  </span>
                  기본 정보 입력
                </CardTitle>
                <CardDescription className="text-gray-500 text-xs md:text-sm mt-1.5">
                  {isSocialSignup
                    ? "카카오에서 전달받은 정보를 기반으로 이메일/비밀번호 입력 없이 가입을 진행합니다."
                    : "이메일, 비밀번호, 휴대폰 번호를 입력하고 MoA 구독 파티에 참여해 보세요."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-6 px-6 pb-6">
                {isSocialSignup && (
                  <>
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs md:text-sm text-indigo-900">
                      <p className="font-semibold">카카오 소셜 회원가입</p>
                      <p className="mt-1 text-indigo-900/80">
                        카카오에서 받은 인증 정보로 이메일/비밀번호는 생략되고,
                        닉네임과 휴대폰 정보만 확인하면 가입이 완료됩니다.
                      </p>
                    </div>

                    <input
                      type="hidden"
                      id="signupProvider"
                      value={provider || ""}
                    />
                    <input
                      type="hidden"
                      id="signupProviderUserId"
                      value={providerUserId || ""}
                    />
                  </>
                )}

                {!isSocialSignup && (
                  <>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="signupEmail"
                        className="text-xs md:text-sm text-gray-800"
                      >
                        이메일(아이디)
                      </Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="예: moa@email.com"
                        className="bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                        onChange={(e) => setField("email", e.target.value)}
                      />
                      <p id="msgEmail" className="text-xs text-gray-500 mt-1" />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="signupPassword"
                        className="text-xs md:text-sm text-gray-800"
                      >
                        비밀번호
                      </Label>
                      <Input
                        id="signupPassword"
                        type="password"
                        placeholder="영문+숫자+특수문자 포함 8~20자"
                        className="bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                        onChange={(e) => setField("password", e.target.value)}
                      />
                      <p
                        id="msgPassword"
                        className="text-xs text-gray-500 mt-1"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="signupPasswordCheck"
                        className="text-xs md:text-sm text-gray-800"
                      >
                        비밀번호 확인
                      </Label>
                      <Input
                        id="signupPasswordCheck"
                        type="password"
                        placeholder="비밀번호를 한 번 더 입력"
                        className="bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                        onChange={(e) =>
                          setField("passwordCheck", e.target.value)
                        }
                      />
                      <p
                        id="msgPasswordCheck"
                        className="text-xs text-gray-500 mt-1"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <Label
                    htmlFor="signupNickname"
                    className="text-xs md:text-sm text-gray-800"
                  >
                    닉네임
                  </Label>
                  <Input
                    id="signupNickname"
                    placeholder="2~10자, 한글/영문/숫자"
                    className="bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                    onChange={(e) => setField("nickname", e.target.value)}
                  />
                  <p id="msgNickname" className="text-xs text-gray-500 mt-1" />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="signupPhone"
                    className="text-xs md:text-sm text-gray-800"
                  >
                    휴대폰 번호
                  </Label>
                  <div className="flex items-end gap-2">
                    <Input
                      id="signupPhone"
                      placeholder="숫자만 입력"
                      readOnly
                      className="flex-1 bg-gray-100 border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400"
                    />
                    <Button
                      type="button"
                      id="btnPhoneVerify"
                      className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold"
                    >
                      본인인증
                    </Button>
                  </div>
                  <p id="msgPhone" className="text-xs text-gray-500 mt-1" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs md:text-sm text-gray-800">
                    프로필 이미지
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center text-gray-400 text-xs">
                      <img
                        id="signupProfilePreview"
                        className="hidden w-full h-full object-cover"
                        alt="profile preview"
                      />
                      <span id="signupProfileEmptyText" className="block">
                        미선택
                      </span>
                    </div>
                    <Input
                      id="signupProfileImage"
                      type="file"
                      accept="image/*"
                      className="bg-white border border-gray-300 text-xs text-gray-900 file:text-xs file:bg-indigo-50 file:text-indigo-700 file:border-0 file:rounded-md file:px-3 file:py-1.5 hover:file:bg-indigo-100"
                      onChange={(e) =>
                        setField("profileImage", e.target.files[0])
                      }
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3 text-xs md:text-sm text-gray-700 flex items-start gap-2">
                  <input
                    id="agreeMarketing"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
                    onChange={(e) =>
                      setField("marketingAgree", e.target.checked)
                    }
                  />
                  <div>
                    <p className="font-medium">마케팅 정보 수신 동의 (선택)</p>
                    <p className="mt-1 text-[11px] md:text-xs text-gray-500">
                      이벤트, 프로모션, 신규 파티 알림을 이메일·문자로 받아볼 수
                      있습니다. 동의하지 않아도 서비스 이용에는 문제가 없습니다.
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-gray-100 px-6 pb-6">
                <Button
                  id="btnSignup"
                  className="w-full h-12 text-sm md:text-base font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  회원가입 완료하고 파티 보러가기
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
