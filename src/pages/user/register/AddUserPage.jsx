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
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher, ChristmasBackground } from "@/config/themeConfig";

// Theme-based styles
const getThemeStyles = (theme) => {
  switch (theme) {
    case 'christmas':
      return {
        bg: 'bg-transparent',
        text: 'text-gray-900',
        subtext: 'text-gray-600',
        highlight: 'text-[#c41e3a]',
        stickerBg: 'bg-white/90 backdrop-blur-sm',
        stickerBorder: 'border border-[#c41e3a]/30',
        stickerShadow: 'shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
        cardBg: 'bg-white/90 backdrop-blur-sm border border-gray-200 shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
        inputBorder: 'border border-gray-200',
        buttonBg: 'bg-[#c41e3a] hover:bg-[#a51830]',
      };
    case 'dark':
      return {
        bg: 'bg-[#0B1120]',
        text: 'text-white',
        subtext: 'text-gray-400',
        highlight: 'text-[#635bff]',
        stickerBg: 'bg-[#1E293B]',
        stickerBorder: 'border border-gray-700',
        stickerShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
        cardBg: 'bg-[#1E293B] border border-gray-700 shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
        inputBorder: 'border border-gray-700 bg-[#0F172A] text-white',
        buttonBg: 'bg-[#635bff] hover:bg-[#5851e8]',
      };
    case 'portrait':
      return {
        bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
        text: 'text-gray-900',
        subtext: 'text-gray-600',
        highlight: 'text-pink-500',
        stickerBg: 'bg-white/80 backdrop-blur-sm',
        stickerBorder: 'border border-pink-200',
        stickerShadow: 'shadow-[4px_4px_12px_rgba(255,181,197,0.2)]',
        cardBg: 'bg-white/80 backdrop-blur-sm border border-pink-200 shadow-[4px_4px_12px_rgba(255,181,197,0.2)]',
        inputBorder: 'border border-pink-200',
        buttonBg: 'bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] hover:opacity-90',
      };
    case 'pop':
      return {
        bg: 'bg-slate-50',
        text: 'text-black',
        subtext: 'text-gray-600',
        highlight: 'text-pink-500',
        stickerBg: 'bg-white',
        stickerBorder: 'border-2 border-black',
        stickerShadow: 'shadow-[4px_4px_0px_rgba(0,0,0,1)]',
        cardBg: 'bg-white border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]',
        inputBorder: 'border-2 border-black',
        buttonBg: 'bg-pink-500 hover:bg-pink-600 border-2 border-black',
      };
    case 'classic':
      return {
        bg: 'bg-white',
        text: 'text-gray-900',
        subtext: 'text-gray-600',
        highlight: 'text-[#635bff]',
        stickerBg: 'bg-white',
        stickerBorder: 'border border-gray-200',
        stickerShadow: 'shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
        cardBg: 'bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
        inputBorder: 'border border-gray-200',
        buttonBg: 'bg-[#635bff] hover:bg-[#5851e8]',
      };
    case 'default':
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-black',
        subtext: 'text-gray-600',
        highlight: 'text-pink-500',
        stickerBg: 'bg-white',
        stickerBorder: 'border border-gray-200',
        stickerShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        cardBg: 'bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        inputBorder: 'border border-gray-200',
        buttonBg: 'bg-slate-900 hover:bg-slate-800',
      };
  }
};

/* LandingPageO3 스타일 컴포넌트 재사용 - 테마 적용 */
function Sticker({ children, rotate = 0, className = "", themeStyles }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: rotate + 3 }}
      className={`
        ${themeStyles?.stickerBg || 'bg-white'}
        ${themeStyles?.stickerBorder || 'border border-gray-200'}
        ${themeStyles?.stickerShadow || 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]'}
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

  // Theme
  const { theme, setTheme } = useThemeStore();
  const themeStyles = getThemeStyles(theme);

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
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} px-6 py-16`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* 좌측 설명 영역 */}
        <div>
          <Sticker rotate={-2} className="inline-block px-5 py-2 mb-6" themeStyles={themeStyles}>
            <span className="font-black text-lg">
              {theme === 'christmas' ? '🎄 MoA 회원가입 ❄️' : 'MoA 회원가입 ✨'}
            </span>
          </Sticker>

          <h1 className={`text-5xl font-black leading-tight mb-6 ${themeStyles.text}`}>
            구독을<br />
            <span className={themeStyles.highlight}>함께</span> 시작해요
          </h1>

          <p className={`text-lg ${themeStyles.subtext} font-medium mb-10`}>
            혼자 쓰기 비싼 OTT 구독,<br />
            이제 MoA에서 친구들과 나눠보세요.
          </p>

          {isSocialSignup && (
            <Sticker rotate={1} className="px-4 py-3 bg-amber-100" themeStyles={themeStyles}>
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
          <Card className={`${themeStyles.cardBg} rounded-3xl`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-black ${themeStyles.text}`}>
                {theme === 'christmas' ? '🎁 기본 정보 입력' : '기본 정보 입력'}
              </CardTitle>
              <CardDescription className={themeStyles.subtext}>
                필수 정보만 입력하면 바로 시작할 수 있어요
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 이메일 */}
              {isSocialSignup && socialEmail && (
                <div>
                  <Label className={themeStyles.text}>이메일 아이디</Label>
                  <Input
                    value={socialEmail}
                    readOnly
                    className={`${theme === 'dark' ? 'bg-[#0F172A] border-gray-700' : 'bg-gray-100'} ${themeStyles.inputBorder}`}
                  />
                </div>
              )}

              {shouldShowEmailInput && (
                <div>
                  <Label className={themeStyles.text}>이메일 아이디</Label>
                  <Input
                    name="email"
                    placeholder="예: moa@email.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={themeStyles.inputBorder}
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
                    <Label className={themeStyles.text}>비밀번호</Label>
                    <Input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={themeStyles.inputBorder}
                    />
                    <p className={`text-xs mt-1 ${errors.password.isError ? "text-red-500" : "text-green-600"}`}>
                      {errors.password.message}
                    </p>
                  </div>

                  <div>
                    <Label className={themeStyles.text}>비밀번호 확인</Label>
                    <Input
                      type="password"
                      name="passwordCheck"
                      value={form.passwordCheck}
                      onChange={handleChange}
                      className={themeStyles.inputBorder}
                    />
                    <p className={`text-xs mt-1 ${errors.passwordCheck.isError ? "text-red-500" : "text-green-600"}`}>
                      {errors.passwordCheck.message}
                    </p>
                  </div>
                </>
              )}

              {/* 닉네임 */}
              <div>
                <Label className={themeStyles.text}>닉네임</Label>
                <Input
                  name="nickname"
                  placeholder="2~10자 영문/숫자/한글"
                  value={form.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={themeStyles.inputBorder}
                />
                <p className={`text-xs mt-1 ${errors.nickname.isError ? "text-red-500" : "text-green-600"}`}>
                  {errors.nickname.message}
                </p>
              </div>

              {/* 휴대폰 */}
              <div>
                <Label className={themeStyles.text}>휴대폰번호</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={form.phone}
                    placeholder="본인인증 후 자동 입력"
                    className={`flex-1 ${theme === 'dark' ? 'bg-[#0F172A] border-gray-700' : 'bg-gray-100'} ${themeStyles.inputBorder}`}
                  />
                  <Button type="button" onClick={handlePassAuth} className={`${themeStyles.buttonBg} text-white`}>
                    본인인증
                  </Button>
                </div>
                <p className={`text-xs mt-1 ${errors.phone.isError ? "text-red-500" : "text-green-600"}`}>
                  {errors.phone.message}
                </p>
              </div>

              {/* 프로필 이미지 */}
              <div>
                <Label className={themeStyles.text}>프로필 이미지</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} className={themeStyles.inputBorder} />
              </div>

              {/* 마케팅 */}
              <div className="flex gap-2 items-start">
                <input
                  type="checkbox"
                  name="agreeMarketing"
                  checked={form.agreeMarketing}
                  onChange={handleChange}
                />
                <span className={`text-sm ${themeStyles.subtext}`}>
                  마케팅 정보 수신 동의 (선택)
                </span>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className={`w-full text-lg font-black ${themeStyles.buttonBg} text-white`}>
                {isSocialSignup ? "간편가입 완료하기" : theme === 'christmas' ? "🎄 회원가입 완료하기" : "회원가입 완료하기"}
              </Button>
            </CardFooter>
          </Card>
        </motion.form>
      </div>
    </div>
  );
}
