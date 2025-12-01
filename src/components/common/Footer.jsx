import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">MoA</h2>
          <p className="mt-3 text-sm text-gray-500 leading-6">
            현명한 구독 생활의 시작. 넷플릭스, 디즈니+, <br />
            유튜브 등 좋아하는 OTT 서비스와 함께하세요.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">서비스</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>넷플릭스 파티</li>
            <li>디즈니+ 파티</li>
            <li>유튜브 프리미엄</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">고객지원</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>
              <Link to="/support" className="hover:text-blue-600">
                고객센터
              </Link>
            </li>
            <li>이용약관</li>
            <li>개인정보처리방침</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
