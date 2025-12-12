import React from "react";
import { Link } from "react-router-dom";

export default function LandingTestPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-2xl w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    랜딩 페이지 A/B/C/D/E/F 테스트
                </h1>
                <p className="text-gray-600 mb-8">
                    원하는 디자인 버전을 선택하여 미리보기해 보세요.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/"
                        className="block w-full py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition duration-200 col-span-1 md:col-span-2"
                    >
                        오리지널 (현재)
                    </Link>

                    <Link
                        to="/landing/a"
                        className="block w-full py-6 px-6 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Variant A<br />
                        <span className="text-sm font-normal opacity-70">모던 & 볼드 (다크)</span>
                    </Link>

                    <Link
                        to="/landing/b"
                        className="block w-full py-6 px-6 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Variant B<br />
                        <span className="text-sm font-normal opacity-70">소프트 & 신뢰 (라이트)</span>
                    </Link>

                    <Link
                        to="/landing/c"
                        className="block w-full py-6 px-6 bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-900 font-semibold rounded-lg shadow-sm transition duration-200"
                    >
                        Variant C<br />
                        <span className="text-sm font-normal opacity-70">미니멀 & 클린</span>
                    </Link>

                    <Link
                        to="/landing/d"
                        className="block w-full py-6 px-6 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-lg shadow-md border-2 border-black transition duration-200"
                    >
                        Variant D<br />
                        <span className="text-sm font-normal opacity-70">팝 & 바이브런트</span>
                    </Link>

                    <Link
                        to="/landing/e"
                        className="block w-full py-6 px-6 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-slate-800 font-bold rounded-lg shadow-md border border-slate-200 transition duration-200"
                    >
                        Variant E<br />
                        <span className="text-sm font-normal opacity-70">파티 리스트 스타일 (앱 느낌)</span>
                    </Link>

                    <Link
                        to="/landing/f"
                        className="block w-full py-6 px-6 bg-black hover:bg-gray-900 text-red-600 font-bold rounded-lg shadow-md border border-gray-800 transition duration-200"
                    >
                        Variant F<br />
                        <span className="text-sm font-normal text-gray-400">스트리밍 서비스 스타일 (OTT)</span>
                    </Link>

                    <Link
                        to="/landing/g"
                        className="block w-full py-6 px-6 bg-slate-950 hover:bg-slate-900 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-bold rounded-lg shadow-md border border-cyan-500/30 transition duration-200"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Variant G</span><br />
                        <span className="text-sm font-normal text-slate-400">Aurora Glassmorphism (몽환적)</span>
                    </Link>

                    <Link
                        to="/landing/h"
                        className="block w-full py-6 px-6 bg-[#fafafa] hover:bg-white text-[#0a0a0a] font-black rounded-lg shadow-md border-2 border-[#0a0a0a] transition duration-200"
                    >
                        Variant H<br />
                        <span className="text-sm font-normal text-gray-500">Editorial Magazine (고급 잡지)</span>
                    </Link>

                    <Link
                        to="/landing/i"
                        className="block w-full py-6 px-6 bg-[#0a0a0f] hover:bg-[#15151f] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 font-black rounded-lg shadow-md border border-cyan-500/50 transition duration-200"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400">Variant I</span><br />
                        <span className="text-sm font-normal text-gray-400">Neon Cyberpunk (미래적)</span>
                    </Link>

                    <Link
                        to="/landing/j"
                        className="block w-full py-6 px-6 bg-[#faf8f5] hover:bg-white text-[#4a6741] font-bold rounded-lg shadow-md border-2 border-[#c5d9c0] transition duration-200"
                    >
                        Variant J<br />
                        <span className="text-sm font-normal text-[#6b6b6b]">Organic Nature (자연 친화적)</span>
                    </Link>

                    <Link
                        to="/landing/k"
                        className="block w-full py-6 px-6 bg-[#0f0a08] hover:bg-[#1a0f0a] text-[#c9a962] font-serif font-light rounded-lg shadow-md border border-[#c9a962]/30 transition duration-200"
                    >
                        Variant K<br />
                        <span className="text-sm font-normal text-[#a39890]">Cinematic Luxury (럭셔리)</span>
                    </Link>

                    <Link
                        to="/landing/l"
                        className="block w-full py-6 px-6 bg-white hover:bg-[#f8fafc] text-[#1a1a2e] font-bold rounded-lg shadow-md border border-[#a78bfa]/30 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-[#a78bfa] via-[#f9a8d4] to-[#6ee7b7] bg-clip-text text-transparent">Variant L</span><br />
                        <span className="text-sm font-normal text-[#64748b]">Scroll Story (스토리텔링)</span>
                    </Link>

                    <Link
                        to="/landing/m"
                        className="block w-full py-6 px-6 bg-[#0a0a0f] hover:bg-[#12121a] text-white font-bold rounded-lg shadow-md border border-blue-500/30 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Variant M</span><br />
                        <span className="text-sm font-normal text-gray-400">Bento Grid + 3D Spatial (공간감 그리드)</span>
                    </Link>

                    <Link
                        to="/landing/n"
                        className="block w-full py-6 px-6 bg-[#fffbf7] hover:bg-white text-slate-800 font-bold rounded-lg shadow-md border border-rose-200 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">Variant N</span><br />
                        <span className="text-sm font-normal text-slate-400">Dreamy Pastel (밝고 몽환적)</span>
                    </Link>

                    <Link
                        to="/landing/o"
                        className="block w-full py-6 px-6 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-lg shadow-md border-4 border-black transition duration-200"
                        style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}
                    >
                        Variant O<br />
                        <span className="text-sm font-normal">Neo-Brutalist Pop (팝 & 바이브런트 개선)</span>
                    </Link>

                    <Link
                        to="/landing/p"
                        className="block w-full py-6 px-6 bg-[#FFF9F5] hover:bg-white text-gray-800 font-bold rounded-lg shadow-md border border-[#E8879B]/30 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-[#E8879B] via-[#F4A574] to-[#8BC5A7] bg-clip-text text-transparent">Variant P</span><br />
                        <span className="text-sm font-normal text-gray-400">Geometric Gradient Flow (로고 색상)</span>
                    </Link>

                    <Link
                        to="/landing/q"
                        className="block w-full py-6 px-6 bg-[#0a0a0f] hover:bg-[#12121a] text-white font-bold rounded-lg shadow-md border border-purple-500/30 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Variant Q</span><br />
                        <span className="text-sm font-normal text-gray-400">Dark Glassmorphism (글래스모피즘)</span>
                    </Link>

                    <Link
                        to="/landing/r"
                        className="block w-full py-6 px-6 bg-[#08090a] hover:bg-[#101114] text-white font-bold rounded-lg shadow-md border border-pink-500/20 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Variant R</span><br />
                        <span className="text-sm font-normal text-gray-400">Linear + Raycast (3D 큐브)</span>
                    </Link>

                    <Link
                        to="/landing/s"
                        className="block w-full py-6 px-6 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg shadow-md border border-gray-200 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Variant S</span><br />
                        <span className="text-sm font-normal text-gray-500">Cal.com + Vercel (클린 SaaS)</span>
                    </Link>

                    <Link
                        to="/landing/t"
                        className="block w-full py-6 px-6 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg shadow-md border border-[#635bff]/20 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] bg-clip-text text-transparent">Variant T</span><br />
                        <span className="text-sm font-normal text-gray-500">Notion + Figma + Stripe (프리미엄 SaaS)</span>
                    </Link>

                    <Link
                        to="/landing/u"
                        className="block w-full py-6 px-6 bg-white hover:bg-purple-50 text-gray-900 font-bold rounded-lg shadow-md border border-purple-200 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Variant U</span><br />
                        <span className="text-sm font-normal text-gray-400">KWANGYA 119 Style (화이트 + 파스텔 블롭)</span>
                    </Link>

                    <Link
                        to="/landing/v"
                        className="block w-full py-6 px-6 bg-white hover:bg-gray-50 text-gray-900 font-black rounded-lg shadow-md border-2 border-black transition duration-200"
                    >
                        Variant V <span className="text-xs font-normal bg-black text-white px-2 py-0.5 rounded-full ml-1">NEW</span><br />
                        <span className="text-sm font-normal text-gray-400">Dropbox Style (극단적 미니멀)</span>
                    </Link>

                    <Link
                        to="/landing/w"
                        className="block w-full py-6 px-6 bg-[#0B1120] hover:bg-[#1E293B] text-white font-bold rounded-lg shadow-md border border-gray-700 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] bg-clip-text text-transparent">Variant W</span>
                        <span className="text-pink-500 ml-1"> DARK</span><br />
                        <span className="text-sm font-normal text-gray-400">Premium Dark SaaS (Variant T의 다크모드)</span>
                    </Link>

                    <Link
                        to="/landing/x"
                        className="block w-full py-6 px-6 bg-[#0a0a0b] hover:bg-[#151518] text-white font-bold rounded-lg shadow-md border border-purple-500/30 transition duration-200"
                        style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)' }}
                    >
                        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Variant X</span>
                        <span className="text-xs font-normal bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-400">Linear/Cursor Style (다크 + 바이브런트)</span>
                    </Link>

                    <Link
                        to="/landing/y"
                        className="block w-full py-6 px-6 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg shadow-md border border-gray-200 transition duration-200"
                    >
                        <span className="text-[#0071e3]">Variant Y</span>
                        <span className="text-xs font-normal bg-[#0071e3] text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-400">Apple Style (프리미엄 미니멀)</span>
                    </Link>

                    <Link
                        to="/landing/z"
                        className="block w-full py-6 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-bold rounded-lg shadow-md transition duration-200"
                    >
                        <span>Variant Z</span>
                        <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-white/80">Framer Style (인터랙티브 플레이풀)</span>
                    </Link>

                    {/* 신규 추가 랜딩 페이지 */}
                    <div className="col-span-1 md:col-span-2 mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4 font-medium">신규 추가</p>
                    </div>

                    <Link
                        to="/landing/hyundai"
                        className="block w-full py-6 px-6 bg-black hover:bg-neutral-900 text-white font-bold rounded-lg shadow-md transition duration-200"
                    >
                        <span className="text-[#EA002C]">Hyundai Card</span>
                        <span className="text-xs font-normal bg-[#EA002C] text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-400">Premium Minimal Black (현대카드 스타일)</span>
                    </Link>

                    <Link
                        to="/landing/o2"
                        className="block w-full py-6 px-6 bg-[#FDFBF7] hover:bg-white text-stone-900 font-bold rounded-lg shadow-md border-2 border-stone-200 transition duration-200"
                    >
                        <span className="text-rose-400">Variant O2</span>
                        <span className="text-xs font-normal bg-rose-400 text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-stone-400">Soft Brutalism (Variant O 톤다운)</span>
                    </Link>

                    <Link
                        to="/landing/o3"
                        className="block w-full py-6 px-6 bg-slate-50 hover:bg-white text-black font-black rounded-lg shadow-md border-4 border-black transition duration-200"
                        style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}
                    >
                        <span className="text-pink-500">Variant O3</span>
                        <span className="text-xs font-normal bg-pink-500 text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-500">Neo-Brutalist Pop Calm (팝 + 차분한 배경)</span>
                    </Link>

                    <Link
                        to="/landing/memphis"
                        className="block w-full py-6 px-6 bg-[#FFF5E6] hover:bg-white text-black font-black rounded-lg shadow-md border-4 border-black transition duration-200"
                        style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}
                    >
                        <span className="text-[#FF6B6B]">Memphis</span>
                        <span className="text-xs font-normal bg-[#4ECDC4] text-black px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-600">80s Memphis Design (복고 팝, 기하학)</span>
                    </Link>

                    <Link
                        to="/landing/collage"
                        className="block w-full py-6 px-6 bg-[#FDF6E3] hover:bg-white text-gray-800 font-bold rounded-lg shadow-md border-2 border-pink-300 transition duration-200"
                    >
                        <span className="text-pink-500">Collage</span>
                        <span className="text-xs font-normal bg-pink-400 text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-500">Scrapbook Style (다이어리, Y2K 감성)</span>
                    </Link>

                    <Link
                        to="/landing/riso"
                        className="block w-full py-6 px-6 bg-[#F5F0E6] hover:bg-white text-gray-800 font-bold rounded-lg shadow-md transition duration-200 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[#0078BF] opacity-10 translate-x-1 translate-y-1" />
                        <div className="absolute inset-0 bg-[#FF6B9D] opacity-10" />
                        <span className="relative text-[#0078BF] font-black">Risograph</span>
                        <span className="relative text-xs font-normal bg-[#FF6B9D] text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="relative text-sm font-normal text-gray-500">Print Style (오버프린트, 그레인 텍스처)</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
