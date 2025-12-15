import React from "react";
import { motion } from "framer-motion";

function Sticker({ children, color = "bg-white", rotate = 0, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, rotate: rotate + 2 }}
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

export default function MainHowItWorksSection() {
  const steps = [
    { num: "01", title: "파티 찾기", desc: "원하는 파티를 검색!", emoji: "🔍", color: "bg-cyan-400" },
    { num: "02", title: "결제하기", desc: "안전하게 결제 완료!", emoji: "💳", color: "bg-pink-500" },
    { num: "03", title: "바로 시청", desc: "즉시 시청 시작!", emoji: "🎬", color: "bg-lime-400" },
  ];

  return (
    <section className="relative px-6 md:px-12 py-20 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Sticker color="bg-white" rotate={1} className="inline-block px-6 py-3 rounded-xl">
            <span className="text-xl md:text-2xl font-black">쉽게 시작해요! 👇</span>
          </Sticker>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.06, rotate: 6 }}
                className={`w-28 h-28 ${s.color} rounded-3xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mx-auto mb-6 flex items-center justify-center`}
              >
                <span className="text-5xl">{s.emoji}</span>
              </motion.div>

              <div className="inline-block bg-black text-white px-4 py-1 rounded-full font-black text-sm mb-4">
                STEP {s.num}
              </div>

              <h3 className="text-2xl font-black mb-2">{s.title}</h3>
              <p className="text-lg font-medium text-gray-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
