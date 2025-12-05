import { useLoginPageLogic } from "@/services/logic/loginPageLogic";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const {
    email,
    password,
    remember,
    setField,
    handleEmailLogin,
    handleKakaoLogin,
    handleGoogleLogin,
  } = useLoginPageLogic();

  return (
    <div className="w-full pb-20 bg-slate-50 text-slate-900">
      <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
              MoA 계정으로 · 구독 파티에 로그인
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3 drop-shadow-md">
              다시 이어서 보기,
              <br />
              <span className="text-indigo-100">로그인 한 번이면 충분해요</span>
            </h1>
            <p className="text-sm sm:text-base text-indigo-50/90 max-w-md mx-auto lg:mx-0 leading-relaxed">
              이메일이나 카카오, Google 계정 중 편한 방법으로 로그인하고 이어서
              구독 파티를 관리해 보세요.
            </p>
          </div>

          <div className="w-full max-w-md">
            <Card className="w-full bg-white border border-gray-100 shadow-2xl rounded-3xl">
              <CardHeader className="pb-3 px-6 pt-6">
                <CardTitle className="text-lg md:text-xl text-gray-900">
                  이메일 로그인
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5 px-6 pb-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="loginEmail"
                    className="text-xs md:text-sm text-gray-800"
                  >
                    이메일
                  </Label>
                  <Input
                    id="loginEmail"
                    placeholder="이메일 입력"
                    value={email}
                    onChange={(e) => setField("email", e.target.value)}
                    className="bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="loginPassword"
                    className="text-xs md:text-sm text-gray-800"
                  >
                    비밀번호
                  </Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => setField("password", e.target.value)}
                    className="bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                  />
                </div>

                <div className="flex justify-between items-center text-xs md:text-sm mt-1">
                  <label className="flex gap-2 items-center text-gray-700">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setField("remember", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>아이디 기억하기</span>
                  </label>

                  <div className="flex gap-4">
                    <button
                      className="text-indigo-50/90 hover:text-white underline-offset-2 hover:underline text-xs md:text-sm"
                      role="link"
                      data-href="/signup"
                    >
                      회원가입
                    </button>
                    <button
                      className="text-indigo-50/90 hover:text-white underline-offset-2 hover:underline text-xs md:text-sm"
                      role="link"
                      data-href="/find-email"
                    >
                      이메일 찾기
                    </button>
                  </div>
                </div>

                <Button
                  id="btnLogin"
                  onClick={handleEmailLogin}
                  className="w-full h-11 text-sm md:text-base font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  로그인
                </Button>

                <div className="flex items-center gap-3 pt-2">
                  <span className="h-px flex-1 bg-gray-200" />
                  <span className="text-[11px] text-gray-400">
                    또는 다른 계정으로 계속하기
                  </span>
                  <span className="h-px flex-1 bg-gray-200" />
                </div>
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-0 flex flex-col gap-3">
                <button
                  id="btnKakaoLogin"
                  onClick={handleKakaoLogin}
                  className="w-full h-[45px] bg-[#FEE500] hover:bg-[#FDD835] rounded-[10px] flex items-center justify-center relative transition-colors shadow-sm"
                >
                  <div className="absolute left-[14px]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 3C5.925 3 1 6.925 1 11.775C1 14.1375 2.525 16.275 4.9375 17.775L4.2875 20.2125C4.1625 20.675 4.675 21.0625 5.0875 20.7875L8.525 18.5125C9.625 18.7875 10.7875 18.925 12 18.925C18.075 18.925 23 15 23 10.15C23 5.3 18.075 3 12 3Z"
                        fill="#000000"
                        fillOpacity="0.9"
                      />
                    </svg>
                  </div>
                  <span className="text-[#000000] text-[15px] font-semibold opacity-85">
                    카카오 로그인
                  </span>
                </button>

                <button
                  id="btnGoogleLogin"
                  onClick={handleGoogleLogin}
                  className="w-full h-[45px] bg-white border border-[#dadce0] hover:bg-[#f8faff] rounded-[10px] flex items-center justify-center relative transition-colors"
                >
                  <div className="absolute left-[14px] flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                        fill="#34A853"
                      />
                      <path
                        d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                        fill="#EA4335"
                      />
                    </svg>
                  </div>
                  <span className="text-[#3c4043] text-[14px] font-medium font-['Roboto']">
                    Google 계정으로 로그인
                  </span>
                </button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
