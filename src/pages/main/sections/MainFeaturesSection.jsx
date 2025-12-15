import React from "react";
import { motion } from "framer-motion";
import { Users, Shield, Zap } from "lucide-react";

function Sticker({ children, color = "bg-white", rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${color}
        border-4 border-black
        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[3px] hover:translate-y-[3px]
        transition-all duration-200
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

function BouncyCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 16 }}
      whileHover={{ y: -8, rotate: 1 }}
      className={`
        bg-white
        border-4 border-black
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        rounded-3xl
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default function MainFeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "파티 공유",
      desc: "최대 4명과 함께 나눠요!",
      color: "bg-cyan-400",
      emoji: "🎉",
    },
    {
      icon: Shield,
      title: "안전 보장",
      desc: "검증/정산으로 안심!",
      color: "bg-lime-400",
      emoji: "🛡️",
    },
    {
      icon: Zap,
      title: "즉시 시작",
      desc: "찾고 결제하면 바로!",
      color: "bg-pink-400",
      emoji: "⚡",
    },
  ];

  return (
    <section className="relative px-6 md:px-12 py-20 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Sticker
            color="bg-lime-400"
            rotate={-2}
            className="inline-block px-6 py-3 rounded-xl mb-6"
          >
            <span className="text-xl md:text-2xl font-black">WHY MoA? 🤔</span>
          </Sticker>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            이래서 <span className="text-pink-500">MoA</span>야!
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <BouncyCard key={f.title} className="p-8 h-full" delay={i * 0.08}>
              <div
                className={`w-20 h-20 ${f.color} rounded-2xl border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              >
                <span className="text-4xl">{f.emoji}</span>
              </div>
              <h3 className="text-2xl font-black mb-3">{f.title}</h3>
              <p className="text-lg text-gray-600 font-medium">{f.desc}</p>
            </BouncyCard>
          ))}
        </div>
      </div>
    </section>
  );
}
