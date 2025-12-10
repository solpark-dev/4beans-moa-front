import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Wallet,
  ArrowRight,
  Sparkles,
  Clock3,
  Ticket,
  Gift,
  Globe2,
  Star as StarIcon,
} from "lucide-react";
import { usePartyStore } from "@/store/party/partyStore";

const Pill = ({ children }) => (
  <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/20 border border-white/30 backdrop-blur text-white flex items-center gap-1">
    <StarIcon className="w-4 h-4" />
    {children}
  </span>
);

export default function MainPage() {
  const navigate = useNavigate();
  const products = usePartyStore((state) => state.products);
  const parties = usePartyStore((state) => state.parties);
  const loadingProducts = usePartyStore((state) => state.loading.products);
  const loadingParties = usePartyStore((state) => state.loading.parties);
  const loadProducts = usePartyStore((state) => state.loadProducts);
  const loadParties = usePartyStore((state) => state.loadParties);

  useEffect(() => {
    if (products.length === 0) loadProducts();
    if (parties.length === 0) loadParties({ size: 6 });
  }, [loadParties, loadProducts, parties.length, products.length]);

  const featuredProducts = useMemo(() => products.slice(0, 6), [products]);
  const popularParties = useMemo(() => parties.slice(0, 4), [parties]);

  return (
    <div className="min-h-screen bg-[#fdf6fb] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf2fa] via-[#f7e7ff] to-[#dff3ff]" />
        <div className="absolute -left-20 -top-32 w-96 h-96 bg-[#fbd3e9] blur-3xl opacity-70" />
        <div className="absolute right-10 -bottom-10 w-[480px] h-[480px] bg-[#c7e7ff] blur-3xl opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Pill>Buy now, save together</Pill>
              <Pill>실시간 파티 매칭</Pill>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-slate-900">
              원하는 구독,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ef476f] via-[#f78fb3] to-[#845ef7]">
                클라르나 무드로 가볍게
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium">
              우리 서비스에 등록된 모든 구독 상품과 파티를 한 번에. 원하는
              상품을 클릭해 상세로 이동하고, 파티에 참여하거나 직접
              만들어보세요.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/party")}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all"
              >
                지금 파티 보기
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/product"
                className="flex items-center gap-2 bg-white/70 text-slate-900 px-6 py-3 rounded-full font-bold border border-slate-200 hover:border-black/20 hover:-translate-y-0.5 transition-all"
              >
                구독 상품 둘러보기
                <Sparkles className="w-4 h-4 text-amber-500" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 max-w-xl">
              {[
                "실시간 상태 동기화",
                "정산·결제 자동화",
                "검증된 파티장",
                "언제든 구독 관리",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3 bg-white/60 backdrop-blur rounded-2xl px-4 py-3 shadow-sm border border-white/70"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f9d7f7] to-[#cde9ff] flex items-center justify-center text-[#d62828]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-sm text-slate-800">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-white/40 blur-3xl" />
            <div className="relative bg-white rounded-[32px] shadow-xl border border-white/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ef476f] to-[#ffd166] flex items-center justify-center text-white font-bold">
                    MoA
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      라이브 매칭
                    </p>
                    <p className="text-lg font-black text-slate-900">
                      오늘의 인기 파티
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/party/create")}
                  className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center gap-2 hover:bg-black"
                >
                  파티 만들기
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {(popularParties.length === 0
                  ? new Array(3).fill(null)
                  : popularParties
                ).map((party, idx) => (
                  <button
                    key={party ? party.partyId : idx}
                    onClick={() => party && navigate(`/party/${party.partyId}`)}
                    className="w-full text-left bg-slate-50/70 border border-white rounded-2xl px-4 py-3 hover:-translate-y-0.5 transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={!party}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0">
                        {party?.productImage ? (
                          <img
                            src={party.productImage}
                            alt={party.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                            상품
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-xs text-slate-500 font-semibold">
                          {party?.productName || "로딩 중"}
                        </p>
                        <p className="font-bold text-slate-900 line-clamp-1">
                          {party?.partyTitle || "파티 정보를 불러오는 중"}
                        </p>
                      </div>

                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {party?.currentParticipants ?? "-"}/
                        {party?.maxParticipants ?? "-"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-xl bg-[#0a0a0a] text-white px-3 py-3 shadow-lg">
                  <Clock3 className="w-4 h-4" />
                  결제일 리마인드
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white text-slate-900 px-3 py-3 border border-slate-100">
                  <Wallet className="w-4 h-4 text-[#ef476f]" />
                  자동 정산 보증
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "차세대 보안 매칭",
              desc: "실제 등록된 파티·상품만 노출되어 안전하게 이용할 수 있어요.",
              icon: ShieldCheck,
              color: "from-[#f78fb3] to-[#fbc2eb]",
            },
            {
              title: "번개 같은 합류",
              desc: "실시간 상태 업데이트로 바로 가입하고 관리하세요.",
              icon: Zap,
              color: "from-[#89f7fe] to-[#66a6ff]",
            },
            {
              title: "지갑까지 편리하게",
              desc: "자동 결제, 정산, 보증금까지 한 번에 처리됩니다.",
              icon: Wallet,
              color: "from-[#f6d365] to-[#fda085]",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="relative overflow-hidden rounded-[28px] bg-white shadow-lg border border-white/80 p-8"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">
                {item.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Products
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              내 프로젝트의 구독 상품
            </h2>
          </div>

          <Link
            to="/product"
            className="text-sm font-bold text-slate-900 flex items-center gap-2 hover:underline"
          >
            전체 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loadingProducts && products.length === 0 && (
            <p className="text-slate-500">구독 상품을 불러오는 중입니다...</p>
          )}

          {!loadingProducts && featuredProducts.length === 0 && (
            <div className="col-span-full bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              등록된 구독 상품이 없습니다. 관리 페이지에서 상품을 추가해보세요.
            </div>
          )}

          {featuredProducts.map((product) => (
            <button
              key={product.productId}
              onClick={() => navigate(`/product/${product.productId}`)}
              className="group text-left bg-white rounded-[24px] border border-white/60 shadow-lg hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div className="p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Img
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500">
                    {product.categoryName || "구독"}
                  </p>
                  <p className="text-lg font-bold text-slate-900 group-hover:text-[#ef476f] transition-colors line-clamp-1">
                    {product.productName}
                  </p>
                  <p className="text-sm text-slate-500">
                    ₩{product.price?.toLocaleString()} / 월
                  </p>
                </div>

                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Parties
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              실제 파티에서 바로 참여하기
            </h2>
          </div>

          <Link
            to="/party"
            className="text-sm font-bold text-slate-900 flex items-center gap-2 hover:underline"
          >
            파티 모두 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingParties && parties.length === 0 ? (
          <p className="text-slate-500">파티 정보를 불러오는 중입니다...</p>
        ) : popularParties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
            아직 모집 중인 파티가 없습니다. 새로운 파티를 만들어보세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularParties.map((party) => (
              <div
                key={party.partyId}
                className="group bg-white rounded-[24px] border border-white/70 shadow-lg hover:-translate-y-1 transition-all p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                      {party.productImage ? (
                        <img
                          src={party.productImage}
                          alt={party.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                          파티
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        {party.productName}
                      </p>
                      <p className="font-bold text-slate-900 line-clamp-1">
                        {party.partyTitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {party.currentParticipants}/{party.maxParticipants}
                  </span>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                  {party.description || "파티 소개를 확인해보세요."}
                </p>

                <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[#ef476f]" />₩
                    {party.pricePerPerson?.toLocaleString?.() ||
                      party.pricePerPerson ||
                      party.pricePerMonth ||
                      "-"}
                    /월
                  </div>

                  <button
                    onClick={() => navigate(`/party/${party.partyId}`)}
                    className="flex items-center gap-1 text-slate-900 hover:text-black"
                  >
                    참여하기
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0a0a0a] via-[#1c1c1c] to-[#2f2f2f] text-white p-10 flex flex-col md:flex-row items-center gap-6">
          <div className="absolute -left-20 -top-20 w-72 h-72 bg-[#ef476f] blur-3xl opacity-20" />
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#ffd166] blur-3xl opacity-20" />

          <div className="relative z-10 flex-1 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">
              <Globe2 className="w-4 h-4" />
              MoA Experience
            </div>

            <h3 className="text-3xl md:text-4xl font-black">
              클라르나 감성으로 정리된 구독 생활
            </h3>

            <p className="text-white/70 text-lg max-w-2xl">
              카드형 UI와 부드러운 파스텔 톤으로, 실제 등록된 구독과 파티를
              직관적으로 확인하세요. 클릭 한 번으로 상세 페이지로 이동합니다.
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate("/subscription")}
                className="flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-full font-bold hover:-translate-y-0.5 transition-all"
              >
                내 구독 관리
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate("/party/create")}
                className="flex items-center gap-2 bg-white/10 text-white px-5 py-3 rounded-full font-bold border border-white/30 hover:-translate-y-0.5 transition-all"
              >
                새 파티 만들기
                <Gift className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-72">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#ef476f] to-[#ffd166] flex items-center justify-center text-2xl font-black">
                M
              </div>

              <p className="text-sm text-white/70">실시간 데이터 기반</p>
              <p className="text-xl font-black">All-in-one 구독 허브</p>
              <p className="text-sm text-white/60">
                상품 · 파티 · 구독 관리까지 한 번에
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
