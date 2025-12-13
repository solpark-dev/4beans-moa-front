import { useSignup } from "@/hooks/auth/useSignup";
import { motion } from "framer-motion";
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

/* LandingPageO3 스타일 컴포넌트 재사용 */
function Sticker({ children, rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: rotate + 3 }}
      className={`
        bg-white
        border-4 border-black
        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        rounded-2xl
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

export default function AddUserPage({ socialInfo }) {
  const isSocialSignup = !!socialInfo;
  const socialEmail = socialInfo?.email;
  const shouldShowEmailInput = !isSocialSignup || !socialEmail;
  const shouldShowPasswordInputs = !isSocialSignup;

  const {
    form,
    errors,
    handleChange,
    handleBlur,
    handleImageChange,
    handlePassAuth,
    handleSubmit,
  } = useSignup({
    mode: isSocialSignup ? "social" : "normal",
    socialInfo,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-black px-6 py-16">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* 좌측 설명 영역 */}
        <div>
          <Sticker rotate={-2} className="inline-block px-5 py-2 mb-6">
            <span className="font-black text-lg">MoA 회원가입 ✨</span>
          </Sticker>

          <h1 className="text-5xl font-black leading-tight mb-6">
            구독을<br />
            <span className="text-pink-500">함께</span> 시작해요
          </h1>

          <p className="text-lg text-gray-600 font-medium mb-10">
            혼자 쓰기 비싼 OTT 구독,<br />
            이제 MoA에서 친구들과 나눠보세요.
          </p>

          {isSocialSignup && (
            <Sticker rotate={1} className="px-4 py-3 bg-amber-100">
              <span className="font-bold">
                카카오 계정으로 간편가입 진행 중입니다
              </span>
            </Sticker>
          )}
        </div>

        {/* 우측 폼 영역 */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl font-black">
                기본 정보 입력
              </CardTitle>
              <CardDescription className="text-gray-600">
                필수 정보만 입력하면 바로 시작할 수 있어요
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 이메일 */}
              {isSocialSignup && socialEmail && (
                <div>
                  <Label>이메일 아이디</Label>
                  <Input
                    value={socialEmail}
                    readOnly
                    className="bg-gray-100 border-2 border-black"
                  />
                </div>
              )}

              {shouldShowEmailInput && (
                <div>
                  <Label>이메일 아이디</Label>
                  <Input
                    name="email"
                    placeholder="예: moa@email.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border-2 border-black"
                  />
                  <p className={`text-xs mt-1 ${errors.email.isError ? "text-red-500" : "text-green-600"}`}>
                    {errors.email.message}
                  </p>
                </div>
              )}

              {/* 비밀번호 (일반 가입만) */}
              {shouldShowPasswordInputs && (
                <>
                  <div>
                    <Label>비밀번호</Label>
                    <Input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="border-2 border-black"
                    />
                    <p className={`text-xs mt-1 ${errors.password.isError ? "text-red-500" : "text-green-600"}`}>
                      {errors.password.message}
                    </p>
                  </div>

                  <div>
                    <Label>비밀번호 확인</Label>
                    <Input
                      type="password"
                      name="passwordCheck"
                      value={form.passwordCheck}
                      onChange={handleChange}
                      className="border-2 border-black"
                    />
                    <p className={`text-xs mt-1 ${errors.passwordCheck.isError ? "text-red-500" : "text-green-600"}`}>
                      {errors.passwordCheck.message}
                    </p>
                  </div>
                </>
              )}

              {/* 닉네임 */}
              <div>
                <Label>닉네임</Label>
                <Input
                  name="nickname"
                  placeholder="2~10자 영문/숫자/한글"
                  value={form.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border-2 border-black"
                />
                <p className={`text-xs mt-1 ${errors.nickname.isError ? "text-red-500" : "text-green-600"}`}>
                  {errors.nickname.message}
                </p>
              </div>

              {/* 휴대폰 */}
              <div>
                <Label>휴대폰번호</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={form.phone}
                    placeholder="본인인증 후 자동 입력"
                    className="flex-1 bg-gray-100 border-2 border-black"
                  />
                  <Button type="button" onClick={handlePassAuth}>
                    본인인증
                  </Button>
                </div>
                <p className={`text-xs mt-1 ${errors.phone.isError ? "text-red-500" : "text-green-600"}`}>
                  {errors.phone.message}
                </p>
              </div>

              {/* 프로필 이미지 */}
              <div>
                <Label>프로필 이미지</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              {/* 마케팅 */}
              <div className="flex gap-2 items-start">
                <input
                  type="checkbox"
                  name="agreeMarketing"
                  checked={form.agreeMarketing}
                  onChange={handleChange}
                />
                <span className="text-sm">
                  마케팅 정보 수신 동의 (선택)
                </span>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full text-lg font-black">
                {isSocialSignup ? "간편가입 완료하기" : "회원가입 완료하기"}
              </Button>
            </CardFooter>
          </Card>
        </motion.form>
      </div>
    </div>
  );
}
