import React from "react";
import { ShieldCheck, Zap, Wallet } from "lucide-react";

const FEATURES = [
  {
    title: "약속 걱정 NO",
    description: "파티원 제공 정보는 100% 검증 후 매칭됩니다.",
    icon: ShieldCheck,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    title: "즉시 매칭",
    description: "가입 즉시 매칭! 실시간 정보 반영.",
    icon: Zap,
    iconClass: "bg-purple-100 text-purple-600",
  },
  {
    title: "자동 정산",
    description: "매월 자동 정산되어 편리하게 이용.",
    icon: Wallet,
    iconClass: "bg-orange-100 text-orange-600",
  },
];

function FeatureCard({ title, description, icon: Icon, iconClass }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow border border-gray-100">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${iconClass}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}

export default function FeatureSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-600 tracking-wider">
              SERVICE PROMISE
            </p>
            <h2 className="text-xl font-extrabold text-gray-900">
              GetSubscription에서 검증한 핵심 가치
            </h2>
          </div>
          <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold hidden md:inline-flex">
            안전한 이용을 위한 3가지 약속
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="border border-gray-100 rounded-2xl p-6 shadow-[0_6px_16px_rgba(17,24,39,0.06)] hover:-translate-y-1 transition-all bg-white"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feature.iconClass}`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-6">
                {feature.description}
              </p>
              <div className="mt-4 text-xs text-indigo-600 font-semibold">
                실시간 상태 제공 · 투명한 정산 · 전담 지원
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
