import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { initSignupPage } from "@/services/logic/addUserPageLogic";

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
          </div>
        </div>

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
              />

              <p className="text-[11px] text-neutral-600">
                정사각형 이미지를 권장하며, 5MB 이하의 파일만 업로드할 수 있어요.
              </p>
            </div>
          </div>
        </div>

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
          </div>
          <p className="text-[11px] text-neutral-700 max-w-md">
            신규 파티, 이벤트, 할인 혜택 소식을 받아볼 수 있어요. 동의하지 않아도
            서비스 이용에는 제한이 없습니다.
          </p>
        </div>

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
    </div>
  );
}
