<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { initSignupPage } from "@/services/logic/addUserPageLogic";

=======
// src/pages/user/AddUserPage.jsx
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
>>>>>>> 7d9bcd392a78308314228b3a2a1722367f30aa91
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useSignupStore } from "@/store/user/signupStore";

export default function AddUserPage() {
  const [params] = useSearchParams();
  const provider = params.get("provider");
  const providerUserId = params.get("providerUserId");
  const isSocialSignup = provider && providerUserId;
  const [fileName, setFileName] = useState("선택된 파일 없음");

  const { setField } = useSignupStore();

  useEffect(() => {
    initSignupPage();
  }, []);

  const inputClass =
    "w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-medium text-neutral-900 " +
    "shadow-[3px_3px_0_0_#000] placeholder:text-neutral-500 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const fileInputClass =
    "w-full rounded-md border-2 border-black bg-white px-2 py-2 text-xs font-medium text-neutral-800 " +
    "shadow-[3px_3px_0_0_#000] cursor-pointer " +
    "file:bg-black file:text-white file:border-0 file:px-3 file:py-1 file:mr-2 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const primaryButtonClass =
    "inline-flex items-center justify-center gap-1.5 rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-semibold text-black " +
    "shadow-[3px_3px_0_0_#000] transition-colors duration-150 " +
    "hover:bg-yellow-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form className="w-full max-w-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000] hover:bg-yellow-50 focus-within:ring-2 focus-within:ring-yellow-300 focus-within:outline-none sm:p-6 space-y-6 transition-colors duration-150">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-neutral-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="size-4"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 1.5a3 3 0 0 0-3 3V6h6V4.5a3 3 0 0 0-3-3Zm-4 7A2.5 2.5 0 0 1 6.5 6h3A2.5 2.5 0 0 1 12 8.5v.75c0 .69-.56 1.25-1.25 1.25h-5.5A1.25 1.25 0 0 1 4 9.25V8.5Z"
                clipRule="evenodd"
              />
            </svg>
            <span>STEP 1 · SIGN UP</span>
          </span>
          <h2 className="mt-1 text-xl font-semibold text-neutral-900">
            MoA 계정 만들기
          </h2>
          <p className="mt-2 text-sm text-neutral-700">
            아래 정보를 정확히 입력하면 바로 MoA의 구독 관리 서비스를 사용할 수
            있어요.
          </p>
        </div>

        {isSocialSignup && (
          <>
            <div className="rounded-md border-2 border-black bg-yellow-50 px-3 py-2 text-xs text-neutral-900 shadow-[3px_3px_0_0_#000]">
              <p className="font-semibold">카카오 소셜 회원가입</p>
              <p className="mt-1 text-[11px] text-neutral-800">
                카카오에서 제공한 정보로 가입을 진행하며, 이메일과 비밀번호 입력은
                생략됩니다.
              </p>
            </div>
            <input type="hidden" value={provider || ""} />
            <input type="hidden" value={providerUserId || ""} />
          </>
        )}

        {!isSocialSignup && (
          <>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-neutral-900">
                이메일(아이디)
              </Label>
              <Input
                placeholder="예: moa@email.com"
                onChange={(e) => setField("email", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-neutral-900">
                비밀번호
              </Label>
              <Input
                type="password"
                placeholder="8~20자 / 영문+숫자 조합"
                onChange={(e) => setField("password", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-neutral-900">
                비밀번호 확인
              </Label>
              <Input
                type="password"
                placeholder="다시 입력"
                onChange={(e) => setField("passwordCheck", e.target.value)}
                className={inputClass}
              />
            </div>
          </>
        )}

        <div className="space-y-1">
          <Label className="text-xs font-semibold text-neutral-900">
            닉네임
          </Label>
          <Input
            onChange={(e) => setField("nickname", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-neutral-900">
            휴대폰 번호
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="숫자만 입력"
              readOnly
              className={
                inputClass +
                " bg-neutral-200 text-neutral-600 cursor-not-allowed"
              }
            />
            <Button
              type="button"
              className={primaryButtonClass + " sm:w-40 w-full"}
            >
              본인인증
            </Button>
=======
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col items-center pt-24 pb-20 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-fuchsia-500/30 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-400/20 blur-[140px]" />

      <div className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.6)] mb-4">
          <span className="flex h-2.5 w-2.5 rounded-full bg-pink-400 mr-2 shadow-[0_0_10px_#f472b6]" />
          NEXUS 멤버십 온보딩 · 첫 가입 한정
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
          MoA 신규 멤버 등록
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          {isSocialSignup
            ? "카카오 계정과 연동하여 빠르게 가입을 완료합니다."
            : "이메일·비밀번호·휴대폰 번호를 정확히 입력해 주세요."}
        </p>
      </div>

      <Card className="relative z-10 w-full max-w-xl bg-slate-900/70 border border-white/10 shadow-[0_0_40px_rgba(15,23,42,0.9)] backdrop-blur-xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-white">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/60 shadow-[0_0_18px_rgba(236,72,153,0.8)]">
              #
            </span>
            기본 정보 입력
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs md:text-sm mt-2">
            {isSocialSignup
              ? "카카오에서 전달받은 정보로 이메일/비밀번호는 생략됩니다."
              : "이메일, 비밀번호, 휴대폰 번호를 입력해주세요."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* 소셜 가입 안내 */}
          {isSocialSignup && (
            <>
              <div className="rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-xs md:text-sm text-yellow-100 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                <p className="font-semibold">카카오 소셜 회원가입</p>
                <p className="mt-1 text-yellow-200/80">
                  이메일/비밀번호 입력 없이 닉네임과 휴대폰 정보만 확인하면
                  가입이 완료됩니다.
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

          {/* 이메일 / 비밀번호 영역 (일반 가입일 때만) */}
          {!isSocialSignup && (
            <>
              <div className="space-y-1.5">
                <Label
                  htmlFor="signupEmail"
                  className="text-xs md:text-sm text-slate-200"
                >
                  이메일(아이디)
                </Label>
                <Input
                  id="signupEmail"
                  type="email"
                  placeholder="예: moa@email.com"
                  className="bg-slate-950/60 border-white/10 text-sm placeholder:text-slate-500 focus-visible:ring-pink-500/70 focus-visible:border-pink-500/60"
                  onChange={(e) => setField("email", e.target.value)}
                />
                <p id="msgEmail" className="text-xs text-slate-500 mt-1" />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="signupPassword"
                  className="text-xs md:text-sm text-slate-200"
                >
                  비밀번호
                </Label>
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="영문+숫자+특수문자 포함 8~20자"
                  className="bg-slate-950/60 border-white/10 text-sm placeholder:text-slate-500 focus-visible:ring-pink-500/70 focus-visible:border-pink-500/60"
                  onChange={(e) => setField("password", e.target.value)}
                />
                <p id="msgPassword" className="text-xs text-slate-500 mt-1" />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="signupPasswordCheck"
                  className="text-xs md:text-sm text-slate-200"
                >
                  비밀번호 확인
                </Label>
                <Input
                  id="signupPasswordCheck"
                  type="password"
                  placeholder="비밀번호를 한 번 더 입력"
                  className="bg-slate-950/60 border-white/10 text-sm placeholder:text-slate-500 focus-visible:ring-pink-500/70 focus-visible:border-pink-500/60"
                  onChange={(e) => setField("passwordCheck", e.target.value)}
                />
                <p
                  id="msgPasswordCheck"
                  className="text-xs text-slate-500 mt-1"
                />
              </div>
            </>
          )}

          {/* 닉네임 */}
          <div className="space-y-1.5">
            <Label
              htmlFor="signupNickname"
              className="text-xs md:text-sm text-slate-200"
            >
              닉네임
            </Label>
            <Input
              id="signupNickname"
              placeholder="2~10자, 한글/영문/숫자"
              className="bg-slate-950/60 border-white/10 text-sm placeholder:text-slate-500 focus-visible:ring-cyan-400/70 focus-visible:border-cyan-400/60"
              onChange={(e) => setField("nickname", e.target.value)}
            />
            <p id="msgNickname" className="text-xs text-slate-500 mt-1" />
          </div>

          {/* 휴대폰 + PASS 인증 */}
          <div className="space-y-1.5">
            <Label
              htmlFor="signupPhone"
              className="text-xs md:text-sm text-slate-200"
            >
              휴대폰 번호
            </Label>
            <div className="flex items-end gap-2">
              <Input
                id="signupPhone"
                placeholder="숫자만 입력"
                readOnly
                className="flex-1 bg-slate-950/60 border-white/10 text-sm placeholder:text-slate-500"
              />
              <Button
                type="button"
                id="btnPhoneVerify"
                className="whitespace-nowrap bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs md:text-sm font-bold shadow-[0_0_18px_rgba(34,211,238,0.6)]"
              >
                본인인증
              </Button>
            </div>
            <p id="msgPhone" className="text-xs text-slate-500 mt-1" />
>>>>>>> 7d9bcd392a78308314228b3a2a1722367f30aa91
          </div>
        </div>

<<<<<<< HEAD
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-neutral-900">
            프로필 이미지
          </Label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-24 h-24 border-2 border-black rounded-md bg-white shadow-[3px_3px_0_0_#000] overflow-hidden flex items-center justify-center">
              <img
                id="signupProfilePreview"
                className="hidden w-full h-full object-cover"
              />
              <span className="text-[11px] text-neutral-500">미리보기</span>
            </div>

            <div className="flex-1 space-y-2">
              <label
                htmlFor="profileImage"
                className="flex items-center justify-between gap-3 w-full border-2 border-black bg-white px-3 py-2 shadow-[4px_4px_0_0_#000] hover:bg-yellow-100 cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-yellow-300 focus-within:ring-offset-2 focus-within:ring-offset-white"
              >
                <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold bg-black text-white rounded-sm">
                  파일 선택
                </span>
                <span className="flex-1 text-xs text-neutral-700 truncate">
                  {fileName}
                </span>
              </label>

              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setField("profileImage", file);
                  setFileName(file ? file.name : "선택된 파일 없음");
                }}
                className="sr-only"
=======
          {/* 프로필 이미지 업로드 */}
          <div className="space-y-2">
            <Label className="text-xs md:text-sm text-slate-200">
              프로필 이미지
            </Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden flex items-center justify-center text-slate-600 text-xs">
                <img
                  id="signupProfilePreview"
                  className="hidden w-full h-full object-cover"
                  alt="profile preview"
                />
              </div>
              <Input
                id="signupProfileImage"
                type="file"
                accept="image/*"
                className="bg-transparent border-white/10 text-xs file:text-xs file:bg-slate-800 file:border-0 file:rounded-md file:px-3 file:py-1.5 file:text-slate-200 hover:file:bg-slate-700"
                onChange={(e) => setField("profileImage", e.target.files[0])}
>>>>>>> 7d9bcd392a78308314228b3a2a1722367f30aa91
              />

              <p className="text-[11px] text-neutral-600">
                정사각형 이미지를 권장하며, 5MB 이하의 파일만 업로드할 수 있어요.
              </p>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="space-y-2 text-sm text-neutral-900">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-[3px] border-2 border-black bg-white cursor-pointer"
              onChange={(e) =>
                setField("marketingAgree", e.target.checked)
              }
            />
            <span className="text-xs font-semibold">
              마케팅 정보 수신 동의 (선택)
            </span>
=======
          {/* 마케팅 동의 */}
          <div className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-xs md:text-sm text-slate-300 flex items-start gap-2">
            <input
              id="agreeMarketing"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-500 bg-slate-900 text-pink-500 focus:ring-pink-500/70"
              onChange={(e) => setField("marketingAgree", e.target.checked)}
            />
            <div>
              <p className="font-medium">마케팅 정보 수신 동의 (선택)</p>
              <p className="mt-1 text-[11px] md:text-xs text-slate-500">
                이벤트, 프로모션, 신규 파티 알림을 이메일·문자로 받아볼 수
                있습니다.
              </p>
            </div>
>>>>>>> 7d9bcd392a78308314228b3a2a1722367f30aa91
          </div>
          <p className="text-[11px] text-neutral-700 max-w-md">
            신규 파티, 이벤트, 할인 혜택 소식을 받아볼 수 있어요. 동의하지 않아도
            서비스 이용에는 제한이 없습니다.
          </p>
        </div>

<<<<<<< HEAD
        <div className="pt-2">
          <Button
            type="button"
            className={primaryButtonClass + " w-full justify-center"}
          >
            회원가입
            <svg
              className="ml-1.5 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 17 5-5-5-5" />
              <path d="m13 17 5-5-5-5" />
            </svg>
          </Button>
        </div>
      </form>
=======
        <CardFooter className="pt-4 border-t border-white/5">
          <Button
            id="btnSignup"
            className="w-full h-12 text-sm md:text-base font-bold rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white shadow-[0_0_22px_rgba(236,72,153,0.7)] hover:shadow-[0_0_32px_rgba(236,72,153,0.9)] hover:brightness-110 transition-all"
          >
            회원가입
          </Button>
        </CardFooter>
      </Card>
>>>>>>> 7d9bcd392a78308314228b3a2a1722367f30aa91
    </div>
  );
}
