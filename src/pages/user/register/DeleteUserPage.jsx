import { motion } from "framer-motion";
import { AlertTriangle, UserX, ArrowRight } from "lucide-react";
import useDeleteUser from "@/hooks/user/useDeleteUser";

function Sticker({
  children,
  color = "bg-white",
  rotate = 0,
  className = "",
  withShadow = true,
}) {
  return (
    <motion.div
      whileHover={withShadow ? { scale: 1.02, x: 2, y: 2 } : undefined}
      whileTap={withShadow ? { scale: 0.98, x: 0, y: 0 } : undefined}
      style={{ rotate }}
      className={`
        ${color}
        border-4 border-black
        ${withShadow ? "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : ""}
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
  color = "bg-pink-500 text-white",
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2, y: 2 }}
      whileTap={{ scale: 0.98, x: 0, y: 0 }}
      className={`
        ${color}
        font-black
        border-4 border-black
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
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

function ReasonRow({ checked, onChange, value, title }) {
  return (
    <label
      className={`
        flex items-center gap-3 cursor-pointer
        border-4 border-black rounded-2xl px-4 py-3
        bg-white
        ${checked ? "outline outline-2 outline-black" : ""}
      `}
    >
      <input
        type="radio"
        name="deleteReason"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="h-4 w-4 accent-black cursor-pointer"
      />
      <span className="font-bold">{title}</span>
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

  return (
    <div className="min-h-screen bg-slate-50 text-black overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <nav className="relative z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Sticker
              color="bg-white"
              rotate={0}
              className="px-4 py-2 rounded-xl"
            >
              <span className="text-2xl font-black tracking-tight">MoA!</span>
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
              color="bg-white"
              rotate={0}
              className="inline-block px-5 py-3 rounded-2xl mb-6"
            >
              <span className="inline-flex items-center gap-2 font-black">
                <AlertTriangle className="w-5 h-5" />
                회원 탈퇴
              </span>
            </Sticker>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter mb-6"
            >
              <span className="block">DELETE</span>
              <span className="block">
                <span className="text-cyan-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  YOUR
                </span>
              </span>
              <span className="block text-pink-500 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                ACCOUNT!
              </span>
            </motion.h1>

            <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
              <Sticker
                color="bg-white"
                rotate={0}
                className="px-5 py-3 rounded-2xl"
              >
                <p className="text-lg md:text-xl font-bold">
                  마지막까지 솔직한 의견을 들려주세요.
                </p>
              </Sticker>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Sticker
                  withShadow={false}
                  color="bg-lime-400"
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                >
                  <span className="font-black">사유 선택</span>
                </Sticker>
                <Sticker
                  withShadow={false}
                  color="bg-cyan-400"
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
                >
                  <span className="font-black">확인</span>
                </Sticker>
                <Sticker
                  withShadow={false}
                  color="bg-pink-500"
                  rotate={0}
                  className="px-4 py-2 rounded-xl"
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
              color="bg-white"
              rotate={0}
              className="rounded-[2.5rem] p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <Sticker
                      withShadow={false}
                      color="bg-black"
                      rotate={0}
                      className="px-3 py-1 rounded-lg"
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
                    >
                      <span className="text-sm font-black">CHECK</span>
                    </Sticker>
                  </div>
                  <p className="text-sm md:text-base font-bold text-gray-600">
                    계정 삭제 전, 꼭 한 번 더 확인해 주세요.
                  </p>
                </div>
                <Sticker
                  withShadow={false}
                  color="bg-white"
                  rotate={0}
                  className="px-3 py-2 rounded-xl"
                >
                  <UserX className="w-6 h-6" />
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
                    >
                      <span className="text-xs font-black">Q</span>
                    </Sticker>
                    <p className="font-black">탈퇴 사유</p>
                  </div>

                  <div className="space-y-3">
                    <ReasonRow
                      value="NOT_USED"
                      title="서비스를 더 이상 사용하지 않음"
                      checked={deleteReason === "NOT_USED"}
                      onChange={onSelectReason}
                    />
                    <ReasonRow
                      value="PRICE"
                      title="가격이 부담됨"
                      checked={deleteReason === "PRICE"}
                      onChange={onSelectReason}
                    />
                    <ReasonRow
                      value="FUNCTION"
                      title="원하는 기능이 부족함"
                      checked={deleteReason === "FUNCTION"}
                      onChange={onSelectReason}
                    />
                    <ReasonRow
                      value="OTHER"
                      title="기타(상세내용 입력)"
                      checked={deleteReason === "OTHER"}
                      onChange={onSelectReason}
                    />
                  </div>
                </div>

                {showDetail && (
                  <div className="space-y-2">
                    <p className="text-sm font-black">상세 사유 (선택)</p>
                    <textarea
                      value={deleteDetail}
                      onChange={(e) => onChangeDetail(e.target.value)}
                      className="
                        w-full border-4 border-black rounded-2xl p-3 text-sm h-28 resize-none
                        focus:outline-none
                      "
                      placeholder="기타 사유 또는 추가 의견이 있다면 입력해 주세요."
                    />
                  </div>
                )}

                <div className="border-4 border-black rounded-3xl p-5 bg-slate-100">
                  <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                    탈퇴 시 계정 정보 및 서비스 이용 이력은 관련 법령에 따라
                    일정 기간 보관 후 안전하게 파기됩니다.
                  </p>
                  <p className="mt-2 text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                    탈퇴 후에는 동일 이메일로 재가입이 제한되거나, 일부 데이터는
                    복구가 불가능할 수 있습니다.
                  </p>
                </div>

                <div className="pt-2 flex items-stretch gap-4">
                  <PopButton
                    type="button"
                    onClick={goMypage}
                    color="bg-white text-black"
                    className="flex-1 text-lg py-4 rounded-2xl"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      마이페이지 <ArrowRight className="w-5 h-5" />
                    </span>
                  </PopButton>

                  <PopButton
                    type="button"
                    onClick={onSubmitDelete}
                    color="bg-red-600 text-white"
                    className="flex-1 text-lg py-4 rounded-2xl"
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
