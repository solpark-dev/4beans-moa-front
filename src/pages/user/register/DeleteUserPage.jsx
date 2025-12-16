import { motion } from "framer-motion";
import { AlertTriangle, UserX, ArrowRight } from "lucide-react";
import useDeleteUser from "@/hooks/user/useDeleteUser";
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
        highlightBg: 'bg-[#c41e3a]',
        stickerBg: 'bg-white/90 backdrop-blur-sm',
        stickerBorder: 'border border-gray-200',
        stickerShadow: 'shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
        cardBg: 'bg-white/90 backdrop-blur-sm',
        cardBorder: 'border border-gray-200',
        inputBorder: 'border border-gray-200',
        buttonPrimary: 'bg-[#c41e3a] text-white hover:bg-[#a51830]',
        buttonSecondary: 'bg-white text-gray-900 hover:bg-gray-50',
        radioChecked: 'outline-[#c41e3a]',
        radioAccent: 'accent-[#c41e3a]',
      };
    case 'dark':
      return {
        bg: 'bg-[#0B1120]',
        text: 'text-white',
        subtext: 'text-gray-400',
        highlight: 'text-[#635bff]',
        highlightBg: 'bg-[#635bff]',
        stickerBg: 'bg-[#1E293B]',
        stickerBorder: 'border border-gray-700',
        stickerShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.3)]',
        cardBg: 'bg-[#1E293B]',
        cardBorder: 'border border-gray-700',
        inputBorder: 'border border-gray-700 bg-[#0F172A]',
        buttonPrimary: 'bg-red-600 text-white hover:bg-red-700',
        buttonSecondary: 'bg-[#1E293B] text-white hover:bg-gray-700',
        radioChecked: 'outline-[#635bff]',
        radioAccent: 'accent-[#635bff]',
      };
    case 'portrait':
      return {
        bg: 'bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        highlight: 'text-pink-500',
        highlightBg: 'bg-pink-500',
        stickerBg: 'bg-white/80 backdrop-blur-sm',
        stickerBorder: 'border border-pink-200',
        stickerShadow: 'shadow-[4px_4px_12px_rgba(255,181,197,0.2)]',
        cardBg: 'bg-white/80 backdrop-blur-sm',
        cardBorder: 'border border-pink-200',
        inputBorder: 'border border-pink-200',
        buttonPrimary: 'bg-red-500 text-white hover:bg-red-600',
        buttonSecondary: 'bg-white text-gray-900 hover:bg-gray-50',
        radioChecked: 'outline-pink-500',
        radioAccent: 'accent-pink-500',
      };
    case 'pop':
      return {
        bg: 'bg-slate-50',
        text: 'text-black',
        subtext: 'text-gray-600',
        highlight: 'text-pink-500',
        highlightBg: 'bg-pink-500',
        stickerBg: 'bg-white',
        stickerBorder: 'border-2 border-black',
        stickerShadow: 'shadow-[4px_4px_0px_rgba(0,0,0,1)]',
        cardBg: 'bg-white',
        cardBorder: 'border-2 border-black',
        inputBorder: 'border-2 border-black',
        buttonPrimary: 'bg-red-600 text-white border-2 border-black hover:bg-red-700',
        buttonSecondary: 'bg-white text-black border-2 border-black hover:bg-gray-50',
        radioChecked: 'outline-black',
        radioAccent: 'accent-pink-500',
      };
    case 'classic':
      return {
        bg: 'bg-white',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        highlight: 'text-[#635bff]',
        highlightBg: 'bg-[#635bff]',
        stickerBg: 'bg-white',
        stickerBorder: 'border border-gray-200',
        stickerShadow: 'shadow-[4px_4px_12px_rgba(99,91,255,0.1)]',
        cardBg: 'bg-white',
        cardBorder: 'border border-gray-200',
        inputBorder: 'border border-gray-200',
        buttonPrimary: 'bg-red-600 text-white hover:bg-red-700',
        buttonSecondary: 'bg-white text-gray-900 hover:bg-gray-50',
        radioChecked: 'outline-[#635bff]',
        radioAccent: 'accent-[#635bff]',
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-black',
        subtext: 'text-gray-600',
        highlight: 'text-pink-500',
        highlightBg: 'bg-pink-500',
        stickerBg: 'bg-white',
        stickerBorder: 'border border-gray-200',
        stickerShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        cardBg: 'bg-white',
        cardBorder: 'border border-gray-200',
        inputBorder: 'border border-gray-200',
        buttonPrimary: 'bg-red-600 text-white hover:bg-red-700',
        buttonSecondary: 'bg-white text-black hover:bg-gray-50',
        radioChecked: 'outline-black',
        radioAccent: 'accent-black',
      };
  }
};

function Sticker({
  children,
  color,
  rotate = 0,
  className = "",
  withShadow = true,
  themeStyles,
}) {
  return (
    <motion.div
      whileHover={withShadow ? { scale: 1.02, x: 2, y: 2 } : undefined}
      whileTap={withShadow ? { scale: 0.98, x: 0, y: 0 } : undefined}
      style={{ rotate }}
      className={`
        ${color || themeStyles?.stickerBg || 'bg-white'}
        ${themeStyles?.stickerBorder || 'border border-gray-200'}
        ${withShadow ? themeStyles?.stickerShadow || "shadow-[4px_4px_12px_rgba(0,0,0,0.08)]" : ""}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

function PopButton({
  children,
  color,
  className = "",
  themeStyles,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2, y: 2 }}
      whileTap={{ scale: 0.98, x: 0, y: 0 }}
      className={`
        ${color || themeStyles?.buttonSecondary}
        font-black
        ${themeStyles?.stickerBorder || 'border border-gray-200'}
        ${themeStyles?.stickerShadow || 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]'}
        transition-all duration-200
        rounded-2xl
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function ReasonRow({ checked, onChange, value, title, themeStyles }) {
  return (
    <label
      className={`
        flex items-center gap-3 cursor-pointer
        ${themeStyles?.inputBorder || 'border border-gray-200'} rounded-2xl px-4 py-3
        ${themeStyles?.cardBg || 'bg-white'}
        ${checked ? `outline outline-2 ${themeStyles?.radioChecked || 'outline-black'}` : ""}
      `}
    >
      <input
        type="radio"
        name="deleteReason"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className={`h-4 w-4 ${themeStyles?.radioAccent || 'accent-black'} cursor-pointer`}
      />
      <span className={`font-bold ${themeStyles?.text}`}>{title}</span>
    </label>
  );
}

export default function DeleteUserPage() {
  const {
    deleteReason,
    deleteDetail,
    showDetail,
    goMypage,
    onSelectReason,
    onChangeDetail,
    onSubmitDelete,
  } = useDeleteUser();

  // Theme
  const { theme, setTheme } = useThemeStore();
  const themeStyles = getThemeStyles(theme);

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} overflow-hidden`}>
      {/* Theme Switcher */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      {/* Christmas Background */}
      {theme === 'christmas' && <ChristmasBackground />}

      {/* Grid Pattern (non-dark themes) */}
      {theme !== 'dark' && theme !== 'christmas' && theme !== 'portrait' && (
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
      )}

      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Sticker
              rotate={0}
              className="px-4 py-2 rounded-xl"
              themeStyles={themeStyles}
            >
              <span className={`text-2xl font-black tracking-tight ${themeStyles.text}`}>MoA!</span>
            </Sticker>
          </motion.div>
          <div />
        </div>
      </nav>

      <section className="relative px-6 md:px-12 pt-6 pb-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <Sticker
              rotate={0}
              className="inline-block px-5 py-3 rounded-2xl mb-6"
              themeStyles={themeStyles}
            >
              <span className={`inline-flex items-center gap-2 font-black ${themeStyles.text}`}>
                <AlertTriangle className="w-5 h-5" />
                {theme === 'christmas' ? '🎄 회원 탈퇴' : '회원 탈퇴'}
              </span>
            </Sticker>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter mb-6 ${themeStyles.text}`}
            >
              <span className="block">DELETE</span>
              <span className="block">
                <span className={`${themeStyles.highlight} ${theme === 'pop' ? 'drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]' : ''}`}>
                  YOUR
                </span>
              </span>
              <span className={`block ${themeStyles.highlight} ${theme === 'pop' ? 'drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]' : ''}`}>
                ACCOUNT!
              </span>
            </motion.h1>

            <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
              <Sticker
                rotate={0}
                className="px-5 py-3 rounded-2xl"
                themeStyles={themeStyles}
              >
                <p className={`text-lg md:text-xl font-bold ${themeStyles.text}`}>
                  마지막까지 솔직한 의견을 들려주세요.
                </p>
              </Sticker>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Sticker
                  withShadow={false}
                  color="bg-lime-400"
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                  themeStyles={themeStyles}
                >
                  <span className="font-black text-black">사유 선택</span>
                </Sticker>
                <Sticker
                  withShadow={false}
                  color="bg-cyan-400"
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                  themeStyles={themeStyles}
                >
                  <span className="font-black text-black">확인</span>
                </Sticker>
                <Sticker
                  withShadow={false}
                  color={themeStyles.highlightBg}
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                  themeStyles={themeStyles}
                >
                  <span className="font-black text-white">탈퇴</span>
                </Sticker>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <Sticker
              rotate={0}
              className="rounded-[2.5rem] p-6 md:p-8"
              themeStyles={themeStyles}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <Sticker
                      withShadow={false}
                      color="bg-black"
                      rotate={0}
                      className="px-3 py-1 rounded-lg"
                      themeStyles={themeStyles}
                    >
                      <span className="text-sm font-black text-white">
                        WARNING
                      </span>
                    </Sticker>
                    <Sticker
                      withShadow={false}
                      color="bg-lime-400"
                      rotate={0}
                      className="px-3 py-1 rounded-lg"
                      themeStyles={themeStyles}
                    >
                      <span className="text-sm font-black text-black">CHECK</span>
                    </Sticker>
                  </div>
                  <p className={`text-sm md:text-base font-bold ${themeStyles.subtext}`}>
                    계정 삭제 전, 꼭 한 번 더 확인해 주세요.
                  </p>
                </div>
                <Sticker
                  withShadow={false}
                  rotate={0}
                  className="px-3 py-2 rounded-xl"
                  themeStyles={themeStyles}
                >
                  <UserX className={`w-6 h-6 ${themeStyles.text}`} />
                </Sticker>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sticker
                      withShadow={false}
                      color="bg-cyan-400"
                      rotate={0}
                      className="px-2 py-1 rounded-lg"
                      themeStyles={themeStyles}
                    >
                      <span className="text-xs font-black text-black">Q</span>
                    </Sticker>
                    <p className={`font-black ${themeStyles.text}`}>탈퇴 사유</p>
                  </div>

                  <div className="space-y-3">
                    <ReasonRow
                      value="NOT_USED"
                      title="서비스를 더 이상 사용하지 않음"
                      checked={deleteReason === "NOT_USED"}
                      onChange={onSelectReason}
                      themeStyles={themeStyles}
                    />
                    <ReasonRow
                      value="PRICE"
                      title="가격이 부담됨"
                      checked={deleteReason === "PRICE"}
                      onChange={onSelectReason}
                      themeStyles={themeStyles}
                    />
                    <ReasonRow
                      value="FUNCTION"
                      title="원하는 기능이 부족함"
                      checked={deleteReason === "FUNCTION"}
                      onChange={onSelectReason}
                      themeStyles={themeStyles}
                    />
                    <ReasonRow
                      value="OTHER"
                      title="기타(상세내용 입력)"
                      checked={deleteReason === "OTHER"}
                      onChange={onSelectReason}
                      themeStyles={themeStyles}
                    />
                  </div>
                </div>

                {showDetail && (
                  <div className="space-y-2">
                    <p className={`text-sm font-black ${themeStyles.text}`}>상세 사유 (선택)</p>
                    <textarea
                      value={deleteDetail}
                      onChange={(e) => onChangeDetail(e.target.value)}
                      className={`
                        w-full ${themeStyles.inputBorder} ${themeStyles.cardBg} rounded-2xl p-3 text-sm h-28 resize-none
                        focus:outline-none ${themeStyles.text}
                      `}
                      placeholder="기타 사유 또는 추가 의견이 있다면 입력해 주세요."
                    />
                  </div>
                )}

                <div className={`${themeStyles.cardBorder} rounded-3xl p-5 ${theme === 'dark' ? 'bg-[#0F172A]' : 'bg-slate-100'}`}>
                  <p className={`text-xs md:text-sm font-bold ${themeStyles.subtext} leading-relaxed`}>
                    탈퇴 시 계정 정보 및 서비스 이용 이력은 관련 법령에 따라
                    일정 기간 보관 후 안전하게 파기됩니다.
                  </p>
                  <p className={`mt-2 text-xs md:text-sm font-bold ${themeStyles.subtext} leading-relaxed`}>
                    탈퇴 후에는 동일 이메일로 재가입이 제한되거나, 일부 데이터는
                    복구가 불가능할 수 있습니다.
                  </p>
                </div>

                <div className="pt-2 flex items-stretch gap-4">
                  <PopButton
                    type="button"
                    onClick={goMypage}
                    color={themeStyles.buttonSecondary}
                    className="flex-1 text-lg py-4 rounded-2xl"
                    themeStyles={themeStyles}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      마이페이지 <ArrowRight className="w-5 h-5" />
                    </span>
                  </PopButton>

                  <PopButton
                    type="button"
                    onClick={onSubmitDelete}
                    color={themeStyles.buttonPrimary}
                    className="flex-1 text-lg py-4 rounded-2xl"
                    themeStyles={themeStyles}
                  >
                    정말 탈퇴할게요
                  </PopButton>
                </div>
              </div>
            </Sticker>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
