import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Users } from "lucide-react";
import { useMainStore } from "@/store/main/mainStore";
import {
  formatCurrency,
  getPartyId,
  getPartyTitle,
  getPartyDescription,
  getPartyPrice,
  getPartyServiceName,
  getPartyHostName,
  getPartyStatus,
  getPartyMembers,
  getPartyMaxMembers,
} from "@/utils/format";

function Sticker({ children, color = "bg-white", rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${color}
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]
        transition-all duration-200
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

function BouncyCard({ children, className = "", delay = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 16 }}
      whileHover={{ y: -8, rotate: 1 }}
      onClick={onClick}
      className={`
        bg-white
        border border-gray-200
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        rounded-3xl
        overflow-hidden
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default function MainTrendingSection() {
  const navigate = useNavigate();
  const parties = useMainStore((s) => s.parties);
  const partiesLoading = useMainStore((s) => s.partiesLoading);
  const partiesError = useMainStore((s) => s.partiesError);

  // 마감 임박 파티 3개 선택 (모집률 높은 순)
  const visible = useMemo(() => {
    const list = Array.isArray(parties) ? [...parties] : [];

    // 모집률(현재 인원 / 최대 인원) 기준으로 정렬 (높은 순)
    const sorted = list
      .map((party) => {
        const members = getPartyMembers(party) || 0;
        const maxMembers = getPartyMaxMembers(party) || 4;
        const fillRatio = members / maxMembers;
        return { party, fillRatio };
      })
      .sort((a, b) => b.fillRatio - a.fillRatio)
      .map((item) => item.party);

    return sorted.slice(0, 3);
  }, [parties]);

  const goParty = (party) => {
    const id = getPartyId(party);
    if (!id) return;
    navigate(`/parties/${id}`);
  };

  return (
    <section className="relative px-6 md:px-12 py-20 bg-slate-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div>
            <Sticker color="bg-pink-500" rotate={-1} className="inline-block px-4 py-2 rounded-xl mb-4">
              <span className="font-black text-white">마감 임박 ⏰</span>
            </Sticker>
            <h2 className="text-4xl md:text-5xl font-black">서두르세요!</h2>
            <p className="text-gray-700 font-medium mt-3">곧 마감되는 파티에 지금 바로 참여하세요.</p>
          </div>

          <Link to="/parties">
            <Sticker color="bg-black" rotate={2} className="px-5 py-3 rounded-xl cursor-pointer">
              <span className="flex items-center gap-2 text-white font-black">
                전체 보기 <ArrowUpRight className="w-5 h-5" />
              </span>
            </Sticker>
          </Link>
        </motion.div>

        {partiesError?.status === 401 && (
          <div className="mb-10">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 font-bold text-gray-800 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
              파티 목록은 로그인 후 확인할 수 있어요. (서버 응답: 인증 필요)
            </div>
          </div>
        )}

        {partiesLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-56 bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] animate-pulse"
              />
            ))}
          </div>
        )}

        {!partiesLoading && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((party, i) => {
                const service = getPartyServiceName(party);
                const host = getPartyHostName(party);
                const title = getPartyTitle(party);
                const desc = getPartyDescription(party);
                const price = getPartyPrice(party);
                const members = getPartyMembers(party) || 0;
                const maxMembers = getPartyMaxMembers(party) || 4;
                const fillPercent = Math.round((members / maxMembers) * 100);
                const status = String(getPartyStatus(party) || "");
                const isRecruiting =
                  status.toUpperCase() === "RECRUITING" ||
                  status.toUpperCase() === "OPEN" ||
                  status.toUpperCase() === "ACTIVE";

                const bg =
                  i % 3 === 0
                    ? "bg-red-500"
                    : i % 3 === 1
                    ? "bg-blue-500"
                    : "bg-indigo-500";

                return (
                  <BouncyCard
                    key={`${getPartyId(party) ?? i}`}
                    delay={i * 0.06}
                    onClick={() => goParty(party)}
                  >
                    <div className={`h-28 ${bg} border-b border-gray-200 flex items-end justify-between p-4`}>
                      <div className="text-white font-black">
                        <div className="text-sm opacity-90">{service || "Party"}</div>
                        <div className="text-xs opacity-80">{host ? `파티장: ${host}` : ""}</div>
                      </div>

                      <Sticker
                        color={isRecruiting ? "bg-cyan-400" : "bg-slate-200"}
                        rotate={-2}
                        className="px-2 py-1 rounded-lg"
                      >
                        <span className="text-xs font-black">
                          {isRecruiting ? "모집중 🙋" : "마감"}
                        </span>
                      </Sticker>
                    </div>

                    <div className="p-4">
                      <div className="font-black text-base line-clamp-2 min-h-[44px]">{title || "-"}</div>
                      <div className="mt-2 text-xs font-bold text-gray-600 line-clamp-2 min-h-[32px]">
                        {desc || ""}
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm font-black text-gray-700">
                            <Users className="w-4 h-4" />
                            <span>{members}/{maxMembers}명</span>
                          </div>
                          <span className="font-black text-pink-500">
                            {formatCurrency(price, { fallback: "0원" })}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                        <div className="text-xs font-bold text-orange-500 text-right">
                          {fillPercent}% 모집 완료
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goParty(party);
                        }}
                        className="mt-4 w-full bg-white border border-gray-200 rounded-2xl py-3 font-black hover:bg-slate-100 transition"
                      >
                        자세히 보기
                      </button>
                    </div>
                  </BouncyCard>
                );
              })}
            </div>

            {visible.length === 0 && (
              <div className="py-16 text-center">
                <div className="inline-block bg-white border border-gray-200 rounded-3xl px-8 py-6 font-black shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
                  표시할 파티가 없습니다.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
