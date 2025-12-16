import { useState, useEffect, useRef, createContext, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// Snow Plow Context
// ============================================
const SnowPlowContext = createContext(null);

export const useSnowPlow = () => useContext(SnowPlowContext);

// ============================================
// Snow Plow Provider
// ============================================
export const SnowPlowProvider = ({ children }) => {
  const [isPlowing, setIsPlowing] = useState(false);
  const [isSnowCleared, setIsSnowCleared] = useState(false);
  const [plowProgress, setPlowProgress] = useState(0); // 0 to 100
  const [accumulation, setAccumulation] = useState(0); // 0 to 100 (Snow accumulation level)
  const [showSnowman, setShowSnowman] = useState(false); // 눈사람 표시 여부
  const [plowId, setPlowId] = useState(0); // For forcing animation reset
  const snowmanTimerRef = useRef(null);

  // 10초 후 눈사람 표시 (테스트용)
  useEffect(() => {
    // 처음 마운트 시 10초 후 눈사람 표시
    snowmanTimerRef.current = setTimeout(() => {
      setShowSnowman(true);
    }, 10000); // 10초

    return () => {
      if (snowmanTimerRef.current) {
        clearTimeout(snowmanTimerRef.current);
      }
    };
  }, []);

  // 제설차가 눈사람에 닿으면 사라지게 (plowProgress 85% 이상)
  useEffect(() => {
    if (isPlowing && plowProgress >= 85 && showSnowman) {
      setShowSnowman(false);
    }
  }, [isPlowing, plowProgress, showSnowman]);

  // Start plowing animation
  const startPlow = () => {
    if (isPlowing || isSnowCleared) return;

    setIsPlowing(true);
    setPlowId(Date.now()); // Force new animation instance
    setPlowProgress(0);

    // 기존 타이머 클리어
    if (snowmanTimerRef.current) {
      clearTimeout(snowmanTimerRef.current);
    }

    // Animate progress from 0 to 100 over 2.5 seconds
    const duration = 2500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPlowProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(animate);
      } else {
        setIsPlowing(false);
        setIsSnowCleared(true);
        setAccumulation(0); // Reset accumulation after plowing

        // Restart accumulation after a short delay
        setTimeout(() => {
          setIsSnowCleared(false);

          // 제설 완료 후 10초 뒤에 다시 눈사람 표시
          snowmanTimerRef.current = setTimeout(() => {
            setShowSnowman(true);
          }, 10000); // 10초
        }, 1000);
      }
    };

    requestAnimationFrame(animate);
  };

  // Reset snow
  const resetSnow = () => {
    setIsSnowCleared(false);
    setPlowProgress(0);
    setAccumulation(0);
  };

  // Accumulate snow over time
  useEffect(() => {
    if (isPlowing || isSnowCleared) return;

    const interval = setInterval(() => {
      setAccumulation(prev => {
        if (prev >= 100) return 100;
        // Accumulate faster initially, then slower (2x speed)
        return prev + (prev < 50 ? 1.0 : 0.5);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlowing, isSnowCleared]);

  const value = {
    isPlowing,
    isSnowCleared,
    plowProgress,
    startPlow,
    resetSnow,
    accumulation, // Expose accumulation level to children
    showSnowman, // 눈사람 표시 여부
    plowId, // Expose for key prop
  };

  return (
    <SnowPlowContext.Provider value={value}>
      {children}
    </SnowPlowContext.Provider>
  );
};

// ============================================
// Snow Plow Button
// ============================================
export const SnowPlowButton = ({ className = "" }) => {
  const context = useSnowPlow();
  const [isShaking, setIsShaking] = useState(false);

  // 30초 후 버튼 흔들기 힌트 (Only if snow piled up)
  useEffect(() => {
    if (!context || context.accumulation < 80) return;

    const timer = setTimeout(() => {
      if (!context.isPlowing && context.accumulation >= 80) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 3000);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [context?.accumulation, context?.isPlowing]);

  if (!context) return null;

  const { isPlowing, isSnowCleared, startPlow } = context;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isShaking ? {
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.5, repeat: 5 }
        } : {}}
        onClick={(e) => {
          e.stopPropagation();
          if (!isSnowCleared && !isPlowing) {
            startPlow();
          }
        }}
        disabled={isPlowing || isSnowCleared}
        className={`p-3 rounded-full shadow-xl transition-all duration-300 ${isPlowing
          ? "bg-orange-500 text-white animate-pulse"
          : isSnowCleared
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:border-orange-300"
          }`}
        title={isSnowCleared ? "눈이 치워졌어요!" : isPlowing ? "제설 중..." : "눈 치우기"}
      >
        <span className="text-xl">{isPlowing ? "🚜" : isSnowCleared ? "✨" : "🚜"}</span>
      </motion.button>
    </div>
  );
};

// ============================================
// Falling Snow Chunk Component - 검색창 밑으로 떨어짐
// ============================================
const FallingSnowChunk = ({ delay, startX, size, zIndex }) => {
  const randomX = useMemo(() => (Math.random() - 0.5) * 60, []);
  const randomRotate = useMemo(() => Math.random() * 360, []);

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        left: startX,
        top: 0,
        zIndex: zIndex,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{
        y: [0, 150, 300, 450], // 떨어지는 거리 증가
        opacity: [1, 1, 0.8, 0],
        scale: [1, 0.95, 0.9, 0.5],
        x: [0, randomX * 0.5, randomX, randomX * 1.5],
        rotate: [0, randomRotate * 0.5, randomRotate],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        ease: "easeIn", // 가속도
      }}
    />
  );
};

// ============================================
// Pushed Snow Mound - 제설차 앞에 쌓이는 눈
// ============================================
const PushedSnowMound = ({ progress }) => {
  // progress 0 -> 100
  // Left to Right direction
  if (progress < 5 || progress > 95) return null;

  return (
    <div
      className="absolute bottom-0 z-40 pointer-events-none"
      style={{
        left: `calc(${progress}% + 40px)`, // Moving Right
        transform: "translateX(-50%)",
        width: "60px",
        height: "40px",
      }}
    >
      <motion.div
        className="w-full h-full relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="absolute bottom-0 left-0 w-10 h-10 bg-white rounded-full blur-[2px]" />
        <div className="absolute bottom-0 left-4 w-8 h-8 bg-gray-100 rounded-full blur-[1px]" />
        <div className="absolute bottom-2 left-2 w-6 h-6 bg-white rounded-full" />
        {/* flying debris */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full animate-ping" />
      </motion.div>
    </div>
  );
};

// ============================================
// Thanksgiving (actually Christmas) Decoration
// ============================================
const ChristmasDecorations = () => {
  const { showSnowman } = useSnowPlow();

  return (
    <div
      className="absolute z-30 pointer-events-none flex items-end"
      style={{
        right: "-30px", // Move further right as requested (negative value to push past padding)
        bottom: "-5px", // 검색박스 바로 위에 붙이기
      }}
    >

      {/* 1. Snowman - Permanent (No Timer) */}
      <motion.img
        src="/snowman.png"
        alt="Snowman"
        className="w-36 h-auto drop-shadow-lg select-none relative z-30 -mr-16" // Increased size to 36 & tighter spacing
        initial={{ scale: 0.9 }}
        animate={{ scale: [0.9, 0.95, 0.9], rotate: [0, -2, 0, 2, 0] }} // Subtle breathing/wiggle
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 2. Christmas Tree */}
      <motion.img
        src="/christmas-tree.png"
        alt="Christmas Tree"
        className="w-36 h-auto drop-shadow-lg select-none relative z-40 -ml-10" // Increased size to 36 & tighter spacing
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

// ============================================
// Snow Pile with Plow Animation
// ============================================
export const ClearableSnowPile = () => {
  const context = useSnowPlow();
  const containerRef = useRef(null);
  const [fallingChunks, setFallingChunks] = useState([]);

  // Generate falling chunks as plow progresses
  useEffect(() => {
    if (!context?.isPlowing) {
      setFallingChunks([]);
      return;
    }

    const interval = setInterval(() => {
      if (context.plowProgress < 100) {
        // Add new falling chunks at the plow position
        const newChunks = Array.from({ length: 3 }, (_, i) => ({
          id: Date.now() + i,
          // StartX follows the plow (Left to Right)
          startX: `${context.plowProgress + (Math.random() - 0.5) * 5}%`,
          size: 8 + Math.random() * 12,
          delay: Math.random() * 0.1,
          zIndex: Math.random() > 0.5 ? 25 : 5,
        }));
        setFallingChunks(prev => [...prev.slice(-40), ...newChunks]);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [context?.isPlowing, context?.plowProgress]);

  if (!context) return null;

  const { isPlowing, isSnowCleared, plowProgress, accumulation, plowId } = context; // destructure plowId

  return (
    <div
      ref={containerRef}
      className="absolute -top-10 left-0 right-0 h-14 pointer-events-none overflow-visible"
    >
      {/* Christmas Decorations Group (Tree + Characters) */}
      <ChristmasDecorations />

      {/* 제설차 애니메이션 - Left to Right */}
      <AnimatePresence>
        {isPlowing && (
          <motion.div
            key={plowId} // Add key to force remount on new plowId
            className="absolute z-50"
            initial={{ left: "-80px" }}
            animate={{ left: "calc(100% - 100px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "linear" }}
            style={{
              top: "-15px"
            }}
          >
            <motion.div
              className="relative"
              style={{ transform: "scaleX(-1)" }} // Face Right
              animate={{
                y: [0, -2, 0, -1, 0],
                rotate: [0, 1, 0, -1, 0]
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-6xl drop-shadow-xl filter saturate-150">🚜</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 밀리는 눈 뭉치 */}
      {isPlowing && <PushedSnowMound progress={plowProgress} />}

      {/* 떨어지는 눈 덩어리들 */}
      <div className="absolute top-10 left-0 right-0 h-[400px] overflow-visible z-50 pointer-events-none">
        <AnimatePresence>
          {fallingChunks.map((chunk) => (
            <FallingSnowChunk
              key={chunk.id}
              startX={chunk.startX}
              size={chunk.size}
              delay={chunk.delay}
              zIndex={chunk.zIndex}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* ===== 눈 쌓임 효과 (Layers) ===== */}

      {/* Layer 1: Back (Behind Search Box) - z-index < 10 */}
      <SnowLayer
        zIndex={5}
        isPlowing={isPlowing}
        isSnowCleared={isSnowCleared}
        plowProgress={plowProgress}
        opacity={0.9}
        offsetY={4}
        seed={123}
        accumulation={accumulation}
      />

      {/* Layer 2: Front (Overlapping Search Box) - z-index > 10 */}
      <SnowLayer
        zIndex={20}
        isPlowing={isPlowing}
        isSnowCleared={isSnowCleared}
        plowProgress={plowProgress}
        opacity={1}
        offsetY={0}
        seed={456}
        accumulation={accumulation}
      />

    </div>
  );
};

// Internal Snow Layer Component
const SnowLayer = ({ zIndex, isPlowing, isSnowCleared, plowProgress, accumulation, opacity, offsetY, seed }) => {
  // Generate random bumps based on seed
  const bumps = useMemo(() => {
    const arr = [];
    const count = 12; // Number of bumps
    for (let i = 0; i < count; i++) {
      // pseudo random
      const x = (i / count) * 100 + (Math.sin(i * seed) * 5);
      const size = 10 + Math.abs(Math.cos(i * seed)) * 15;
      const y = Math.abs(Math.sin(i * 99)) * 10;
      arr.push({ x, size, y });
    }
    return arr;
  }, [seed]);

  // Adjust height based on accumulation
  // accumulation 0 -> 0px
  // accumulation 100 -> full height
  const currentHeightPercent = Math.max(accumulation, 10); // Minimum 10% visible

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 overflow-visible"
      style={{
        height: "4rem", // Full potential height
        zIndex: zIndex,
        bottom: -offsetY, // Adjust vertical position
        clipPath: isPlowing
          ? `inset(0 0 0 ${plowProgress}%)` // Cut from Left to Right
          : isSnowCleared
            ? "inset(0 0 0 100%)"
            : "inset(0 0 0 0)",

        // Growth animation based on accumulation
        transformOrigin: "bottom",
        scaleY: currentHeightPercent / 100,
        opacity: isSnowCleared ? 0 : opacity * (Math.min(accumulation + 20, 100) / 100),
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Main jagged shape */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 bg-white rounded-t-xl"
        style={{
          clipPath: "polygon(0% 100%, 5% 40%, 12% 65%, 20% 30%, 28% 55%, 35% 25%, 45% 40%, 55% 20%, 65% 50%, 75% 30%, 85% 60%, 95% 35%, 100% 100%)",
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
        }}
      />

      {/* Random round bumps for natural look */}
      {bumps.map((b, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full shadow-sm"
          style={{
            left: `${b.x}%`,
            bottom: b.y - 5,
            width: b.size,
            height: b.size,
            opacity: 0.95
          }}
        />
      ))}
    </motion.div>
  );
};

export default SnowPlowProvider;
