export function LoginHero({ shortId }) {
  return (
    <div className="text-center lg:text-left max-w-xl">
      <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
        <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
        MoA 계정으로 · 구독 파티에 로그인
        {shortId ? ` · ID: ${shortId}` : null}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3 drop-shadow-md">
        다시 이어보기,
        <br />
        <span className="text-indigo-100">로그인부터 안전하게</span>
      </h1>
      <p className="text-sm sm:text-base text-indigo-50/90 max-w-md mx-auto lg:mx-0 leading-relaxed">
        이메일, 카카오, Google 계정으로 로그인하고 구독 파티를 관리하세요. 입력
        오류를 바로 보여주고, 인증 단계도 명확하게 안내합니다.
      </p>
    </div>
  );
}
