import React, { useRef, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Sparkles, Users, ArrowRight, Plus, Search } from "lucide-react";
import { NeoCard } from "@/components/common/neo";
import {
  formatCurrency,
  getPartyServiceName,
  getPartyPrice,
  getPartyMembers,
  getProductMaxProfiles,
} from "@/utils/format";

// ============================================
// Confetti Component - 둥둥 떠다니는 종이 조각
// ============================================
const Confetti = () => {
  const confettiPieces = [
    { color: "bg-pink-400", size: "w-4 h-4", left: "5%", delay: 0, duration: 8, rotate: 45 },
    { color: "bg-cyan-400", size: "w-3 h-3", left: "15%", delay: 1.2, duration: 10, rotate: -30 },
    { color: "bg-lime-400", size: "w-5 h-2", left: "25%", delay: 0.5, duration: 9, rotate: 60 },
    { color: "bg-yellow-400", size: "w-3 h-3", left: "35%", delay: 2, duration: 11, rotate: -45 },
    { color: "bg-pink-500", size: "w-2 h-5", left: "45%", delay: 0.8, duration: 8.5, rotate: 30 },
    { color: "bg-blue-400", size: "w-4 h-3", left: "55%", delay: 1.5, duration: 10.5, rotate: -60 },
    { color: "bg-purple-400", size: "w-3 h-4", left: "65%", delay: 0.3, duration: 9.5, rotate: 45 },
    { color: "bg-cyan-300", size: "w-2 h-2", left: "75%", delay: 2.5, duration: 8, rotate: -30 },
    { color: "bg-orange-400", size: "w-4 h-2", left: "85%", delay: 1, duration: 11, rotate: 60 },
    { color: "bg-lime-300", size: "w-3 h-3", left: "92%", delay: 0.7, duration: 9, rotate: -45 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {confettiPieces.map((piece, index) => (
        <motion.div
          key={index}
          className={`absolute ${piece.color} ${piece.size} rounded-sm border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}
          style={{ left: piece.left, top: -20 }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [piece.rotate, piece.rotate + 360],
            x: [0, Math.sin(index) * 50, 0, Math.sin(index) * -30, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function MainHeroSection({ parties, products = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  // portrait-v2 스타일: useInView로 섹션 감지
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const desktopCardsRef = useRef(null);
  const mobileCardsRef = useRef(null);

  // 히어로 섹션이 보일 때 감지
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  // 카드 섹션 타이틀 감지
  const isCardsInView = useInView(cardsRef, { once: false, amount: 0.3 });
  // 데스크탑 카드 감지
  const isDesktopCardsInView = useInView(desktopCardsRef, { once: false, amount: 0.4 });
  // 모바일 카드 감지
  const isMobileCardsInView = useInView(mobileCardsRef, { once: false, amount: 0.4 });

  // 한글-영어 매핑
  const koreanToEnglish = {
    "넷플릭스": "netflix", "넷플": "netflix",
    "디즈니": "disney", "디즈니플러스": "disney",
    "유튜브": "youtube", "유튭": "youtube",
    "스포티파이": "spotify", "스포티": "spotify",
    "웨이브": "wavve", "왓챠": "watcha",
    "티빙": "tving", "쿠팡": "coupang", "쿠팡플레이": "coupang",
    "애플": "apple", "애플뮤직": "apple", "애플티비": "apple",
  };

  // 구독상품 검색 필터링
  const filteredProducts = searchQuery.trim()
    ? products.filter((p) => {
        const name = (p?.productName || p?.name || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        if (name.includes(query)) return true;
        for (const [kor, eng] of Object.entries(koreanToEnglish)) {
          if (query.includes(kor) && name.includes(eng)) return true;
        }
        return false;
      }).slice(0, 5)
    : [];

  // 흩어진 위치 (초기)
  const scatterPositions = [
    { x: -320, y: -180, rotate: -12, scale: 0.9 },
    { x: 320, y: -160, rotate: 15, scale: 0.85 },
    { x: -380, y: 80, rotate: 8, scale: 0.88 },
    { x: 360, y: 100, rotate: -10, scale: 0.92 },
    { x: -200, y: 220, rotate: 18, scale: 0.86 },
    { x: 200, y: 240, rotate: -15, scale: 0.9 },
  ];

  // 모인 그리드 위치 (최종)
  const gridPositions = [
    { x: -200, y: -90, rotate: 0, scale: 1 },
    { x: 0, y: -90, rotate: 0, scale: 1 },
    { x: 200, y: -90, rotate: 0, scale: 1 },
    { x: -200, y: 100, rotate: 0, scale: 1 },
    { x: 0, y: 100, rotate: 0, scale: 1 },
    { x: 200, y: 100, rotate: 0, scale: 1 },
  ];

  // 서비스별 색상 매핑
  const serviceColors = {
    "넷플릭스": { bg: "bg-red-500", emoji: "N" },
    "netflix": { bg: "bg-red-500", emoji: "N" },
    "디즈니+": { bg: "bg-blue-500", emoji: "D+" },
    "disney": { bg: "bg-blue-500", emoji: "D+" },
    "유튜브": { bg: "bg-red-600", emoji: "Y" },
    "youtube": { bg: "bg-red-600", emoji: "Y" },
    "스포티파이": { bg: "bg-lime-400", emoji: "S" },
    "spotify": { bg: "bg-lime-400", emoji: "S" },
    "웨이브": { bg: "bg-cyan-400", emoji: "W" },
    "wavve": { bg: "bg-cyan-400", emoji: "W" },
    "왓챠": { bg: "bg-yellow-400", emoji: "왓" },
    "watcha": { bg: "bg-yellow-400", emoji: "왓" },
  };

  const defaultColors = ["bg-red-500", "bg-blue-500", "bg-pink-500", "bg-lime-400", "bg-cyan-400", "bg-yellow-400"];

  // 파티가 없을 때 표시할 빈 카드 데이터
  const emptyCards = [
    { id: 1, isEmpty: true, bgColor: "bg-red-500", emoji: "N", serviceName: "넷플릭스" },
    { id: 2, isEmpty: true, bgColor: "bg-blue-500", emoji: "D+", serviceName: "디즈니+" },
    { id: 3, isEmpty: true, bgColor: "bg-pink-500", emoji: "Y", serviceName: "유튜브" },
    { id: 4, isEmpty: true, bgColor: "bg-lime-400", emoji: "S", serviceName: "스포티파이" },
    { id: 5, isEmpty: true, bgColor: "bg-cyan-400", emoji: "W", serviceName: "웨이브" },
    { id: 6, isEmpty: true, bgColor: "bg-yellow-400", emoji: "왓", serviceName: "왓챠" },
  ];

  // 카드 데이터
  const cards = useMemo(() => {
    if (!Array.isArray(parties) || parties.length === 0) {
      return emptyCards;
    }

    return parties.slice(0, 6).map((party, i) => {
      const serviceName = getPartyServiceName(party) || "OTT";
      const serviceNameLower = serviceName.toLowerCase();

      let colorInfo = null;
      for (const [key, value] of Object.entries(serviceColors)) {
        if (serviceNameLower.includes(key.toLowerCase())) {
          colorInfo = value;
          break;
        }
      }

      const currentMembers = getPartyMembers(party);
      const maxMembers = getProductMaxProfiles(party) || party?.maxMembers || 4;
      const membersText = currentMembers !== null ? `${currentMembers}/${maxMembers}` : "0/4";

      return {
        id: party?.partyId || party?.id || i + 1,
        isEmpty: false,
        name: serviceName,
        category: party?.category || "영상",
        price: formatCurrency(getPartyPrice(party), { fallback: "-" }),
        members: membersText,
        bgColor: colorInfo?.bg || defaultColors[i % defaultColors.length],
        emoji: colorInfo?.emoji || serviceName.charAt(0).toUpperCase(),
      };
    });
  }, [parties]);

  return (
    <>
      {/* 히어로 섹션 */}
      <section ref={heroRef} className="relative pt-32 pb-10 flex flex-col items-center justify-center overflow-hidden px-6">
        <Confetti />

        {/* 메인 헤드라인 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-4xl mx-auto"
        >
          {/* 플로팅 스티커 - 좌측 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute top-24 left-[10%] hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [-8, -12, -8] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <NeoCard color="bg-lime-400" rotate={-8} className="px-3 py-1 rounded-lg">
                <span className="font-bold text-sm">NEW!</span>
              </NeoCard>
            </motion.div>
          </motion.div>

          {/* 플로팅 스티커 - 우측 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute top-20 right-[15%] hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <NeoCard color="bg-cyan-400" rotate={12} className="px-4 py-2 rounded-xl">
                <span className="font-black text-lg">75% OFF!</span>
              </NeoCard>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <NeoCard color="bg-white" rotate={1} className="inline-block px-5 py-2 rounded-xl mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-pink-500" />
                <span className="font-bold">구독료, 이제 똑똑하게 나눠요</span>
              </div>
            </NeoCard>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[56px] md:text-[80px] lg:text-[100px] font-black leading-[0.95] tracking-tighter mb-6"
          >
            <span className="block transform -rotate-1">SHARE</span>
            <span className="block transform rotate-1">
              <span className="text-cyan-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">YOUR</span>
            </span>
            <span className="block transform -rotate-1 text-pink-500 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              OTT!
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <NeoCard color="bg-white" rotate={-1} className="inline-block px-6 py-3 rounded-xl mb-8">
              <p className="text-lg md:text-xl font-bold">
                넷플릭스, 디즈니+, 유튜브 프리미엄까지 함께 나누면 최대 75% 절약!
              </p>
            </NeoCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <button className="px-4 py-3 font-bold bg-pink-500 text-white border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-all text-sm flex items-center gap-2">
                회원가입
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/party/create">
              <button className="px-4 py-3 font-bold bg-cyan-400 text-black border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-all text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                파티 만들기
              </button>
            </Link>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                placeholder="구독상품 검색"
                className="w-36 sm:w-44 px-4 py-3 pl-10 font-bold bg-white border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] focus:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-all outline-none text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              {/* 검색 결과 드롭다운 */}
              <AnimatePresence>
                {showResults && searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-[6px_6px_16px_rgba(0,0,0,0.12)] overflow-hidden z-50 min-w-[200px]"
                  >
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <Link
                          key={product?.productId || product?.id}
                          to={`/mypage/subscriptions/add?productId=${product?.productId || product?.id}`}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-pink-50 transition-colors border-b border-gray-200 last:border-0"
                        >
                          <span className="font-black text-sm">{product?.productName || product?.name}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 font-bold">
                        검색 결과 없음
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* 스크롤 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-16 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-400 text-sm flex flex-col items-center gap-2"
          >
            <span className="text-3xl md:text-4xl font-light">↓</span>
          </motion.div>
        </motion.div>
      </section>

      {/* 카드 그리드 섹션 - portrait-v2 스타일 */}
      <section ref={cardsRef} className="relative flex flex-col items-center overflow-hidden px-6 pt-10 pb-20">
        {/* 섹션 타이틀 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24 z-20"
        >
          <NeoCard color="bg-lime-400" rotate={-2} className="inline-block px-6 py-3 rounded-xl mb-4">
            <span className="text-xl font-black">HOT PARTY! 🔥</span>
          </NeoCard>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black">
            지금 인기 있는 파티
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-3 font-bold">원하는 서비스를 골라 바로 참여하세요</p>
        </motion.div>

        {/* 데스크탑 버전 - 카드가 날아와서 모임 */}
        <div ref={desktopCardsRef} className="hidden md:flex relative w-full max-w-5xl h-[450px] items-center justify-center">
          {cards.map((card, index) => {
            const scatter = scatterPositions[index];
            const grid = gridPositions[index];

            return (
              <motion.div
                key={card.id}
                initial={{
                  x: scatter.x,
                  y: scatter.y,
                  rotate: scatter.rotate,
                  scale: scatter.scale,
                  opacity: 0
                }}
                animate={isDesktopCardsInView ? {
                  x: grid.x,
                  y: grid.y,
                  rotate: grid.rotate,
                  scale: grid.scale,
                  opacity: 1
                } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + index * 0.1,
                  ease: [0.4, 0.0, 0.2, 1]
                }}
                className="absolute"
              >
                <ServiceCard card={card} />
              </motion.div>
            );
          })}
        </div>

        {/* 모바일 버전 - 2열 3행 그리드 */}
        <div ref={mobileCardsRef} className="md:hidden grid grid-cols-2 gap-4 w-full max-w-[360px] mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isMobileCardsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.1,
                ease: [0.4, 0.0, 0.2, 1]
              }}
            >
              <ServiceCard card={card} />
            </motion.div>
          ))}
        </div>

        {/* 파티 전체보기 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 z-20"
        >
          <Link to="/party">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-pink-500 text-white font-black rounded-full border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-all"
            >
              🍿 파티 전체보기
            </motion.div>
          </Link>
        </motion.div>
      </section>
    </>
  );
}

// 서비스 카드 컴포넌트
function ServiceCard({ card }) {
  // 파티가 없는 빈 카드
  if (card.isEmpty) {
    return (
      <Link to="/party/create">
        <motion.div
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="w-[150px] md:w-[170px] bg-white border border-gray-200 rounded-2xl p-4 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] cursor-pointer hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-all"
        >
          <div className={`w-10 h-10 ${card.bgColor} rounded-xl border border-gray-200 flex items-center justify-center mb-3`}>
            <span className="text-white font-black text-lg">{card.emoji}</span>
          </div>
          <h3 className="font-black text-black text-sm mb-1">{card.serviceName}</h3>
          <div className="mt-2 flex items-center gap-1 text-pink-500">
            <Plus size={14} className="stroke-[3]" />
            <span className="text-xs font-black">파티원 찾기</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold mt-1">
            지금 바로 시작하세요!
          </p>
        </motion.div>
      </Link>
    );
  }

  // 파티가 있는 일반 카드
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="w-[150px] md:w-[170px] bg-white border border-gray-200 rounded-2xl p-4 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-shadow"
    >
      <div className={`w-10 h-10 ${card.bgColor} rounded-xl border border-gray-200 flex items-center justify-center mb-3`}>
        <span className="text-white font-black text-lg">{card.emoji}</span>
      </div>
      <h3 className="font-black text-black text-sm mb-1">{card.name}</h3>
      <p className="text-xs text-gray-500 font-bold mb-3">{card.category}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-black text-pink-500">{card.price}</p>
          <p className="text-[10px] text-gray-400 font-bold">월 비용</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-black bg-lime-400 px-2 py-1 rounded-full border border-gray-200">
          <Users size={12} />
          <span>{card.members}</span>
        </div>
      </div>
    </motion.div>
  );
}
