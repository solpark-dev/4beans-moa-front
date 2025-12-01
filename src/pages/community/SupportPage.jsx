import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronUp,
  X,
  HelpCircle,
  MessageCircle,
  FileText,
} from "lucide-react";

const MOCK_FAQS = [
  {
    id: 1,
    question: "구독 해지는 어떻게 하나요?",
    answer:
      "마이페이지 > 구독 관리 메뉴에서 언제든지 해지 신청이 가능합니다. 해지 시 남은 기간에 대한 금액은 일할 계산되어 환불됩니다.",
  },
  {
    id: 2,
    question: "결제 수단 변경은 어떻게 하나요?",
    answer:
      "마이페이지 > 결제 관리에서 등록된 카드를 변경하거나 새로운 결제 수단을 추가할 수 있습니다.",
  },
  {
    id: 3,
    question: "파티는 어떻게 만드나요?",
    answer:
      '메인 페이지의 "파티 만들기" 버튼을 클릭하여 원하는 서비스를 선택하고 파티를 생성할 수 있습니다.',
  },
  {
    id: 4,
    question: "AI 추천은 어떤 기준으로 이루어지나요?",
    answer:
      "사용자의 시청 패턴, 선호 장르, 구독 이력을 분석하여 가장 적합한 파티와 서비스를 추천해 드립니다.",
  },
];

const MOCK_NOTICES = [
  {
    id: 1,
    title: "시스템 정기 점검 안내 (8/25 02:00 ~ 04:00)",
    date: "2024-08-18",
    tag: "점검",
  },
  {
    id: 2,
    title: "개인정보처리방침 개정 안내",
    date: "2024-08-01",
    tag: "안내",
  },
  {
    id: 3,
    title: "신규 구독 상품 출시 안내 (Wave, Tving)",
    date: "2024-07-20",
    tag: "이벤트",
  },
];

const MOCK_INQUIRIES = [
  {
    id: 1,
    title: "결제 오류 문의",
    content: "결제가 중복으로 된 것 같습니다. 확인 부탁드립니다.",
    date: "2024-08-20",
    status: "answered",
    answer:
      "안녕하세요. 확인 결과 일시적인 오류로 중복 결제가 발생하여 즉시 취소 처리 도와드렸습니다. 불편을 드려 죄송합니다.",
  },
  {
    id: 2,
    title: "파티 멤버 강퇴 기능 문의",
    content: "파티장이 멤버를 강퇴할 수 있나요?",
    date: "2024-08-15",
    status: "answered",
    answer:
      "네, 파티장은 규칙을 위반한 멤버를 강퇴할 수 있는 권한이 있습니다. 파티 관리 메뉴를 확인해주세요.",
  },
  {
    id: 3,
    title: "해지 후 환불 절차 문의",
    content: "해지하면 언제 환불되나요?",
    date: "2024-08-10",
    status: "waiting",
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);
  const [newInquiry, setNewInquiry] = useState({ title: "", content: "" });
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const toggleFaq = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!newInquiry.title || !newInquiry.content) return;

    const inquiry = {
      id: inquiries.length + 1,
      title: newInquiry.title,
      content: newInquiry.content,
      date: new Date().toISOString().split("T")[0],
      status: "waiting",
    };

    setInquiries([inquiry, ...inquiries]);
    setNewInquiry({ title: "", content: "" });
    alert("문의가 등록되었습니다.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-[#1e1e4b] text-white pt-16 pb-24 px-4 relative">
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="검색어를 입력해보세요 (예: 환불, 결제)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white text-slate-900 rounded-full shadow-lg focus:outline-none transition-all text-base placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20 pb-20">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-8 flex items-center justify-center p-2 gap-2">
          {["faq", "notice", "inquiry"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-[#5c5cff] text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab === "faq" && <HelpCircle className="w-4 h-4" />}
              {tab === "notice" && <FileText className="w-4 h-4" />}
              {tab === "inquiry" && <MessageCircle className="w-4 h-4" />}
              {tab === "faq" && "자주 묻는 질문"}
              {tab === "notice" && "공지사항"}
              {tab === "inquiry" && "1:1 문의"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border p-6 md:p-10 min-h-[500px]">
          {/* FAQ */}
          {activeTab === "faq" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  자주 묻는 질문
                </h2>
                <p className="text-slate-500">
                  궁금한 점을 빠르게 해결해 보세요.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {MOCK_FAQS.map((faq) => (
                  <div key={faq.id} className="py-4">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex justify-between items-center text-left font-medium text-slate-800"
                    >
                      {faq.question}
                      {expandedFaqId === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {expandedFaqId === faq.id && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-xl text-slate-600 text-sm">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTICE */}
          {activeTab === "notice" && (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  공지사항
                </h2>
                <p className="text-slate-500">
                  구독 매니저의 새로운 소식을 확인하세요.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="flex justify-between text-sm text-slate-400 pb-2 border-b">
                  <span>제목</span>
                  <span>작성일</span>
                </div>

                {MOCK_NOTICES.map((notice) => (
                  <div
                    key={notice.id}
                    className="py-4 flex justify-between items-center hover:bg-slate-50 px-2 rounded-lg cursor-pointer"
                  >
                    <span className="font-medium text-slate-800">
                      {notice.title}
                    </span>
                    <span className="text-sm text-slate-500">
                      {notice.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inquiry */}
          {activeTab === "inquiry" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fadeIn">
              {/* Form */}
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    1:1 문의하기
                  </h2>
                  <p className="text-slate-500">
                    문의사항을 남겨주시면 빠르게 답변해드리겠습니다.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      제목
                    </label>
                    <input
                      type="text"
                      value={newInquiry.title}
                      onChange={(e) =>
                        setNewInquiry({ ...newInquiry, title: e.target.value })
                      }
                      placeholder="제목을 입력하세요."
                      className="w-full px-4 py-3 bg-white border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      내용
                    </label>
                    <textarea
                      value={newInquiry.content}
                      onChange={(e) =>
                        setNewInquiry({
                          ...newInquiry,
                          content: e.target.value,
                        })
                      }
                      placeholder="문의 내용을 자세히 작성해주세요."
                      rows={8}
                      className="w-full px-4 py-3 bg-white border rounded-xl resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#5c5cff] text-white font-bold rounded-xl"
                  >
                    문의 제출
                  </button>
                </form>
              </div>

              {/* Inquiry List */}
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    내 문의 내역
                  </h2>
                  <p className="text-slate-500">
                    내가 작성한 문의들의 처리 현황을 확인합니다.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="flex justify-between text-sm text-slate-400 pb-2 border-b">
                    <span>제목</span>
                    <span>상태</span>
                  </div>

                  {inquiries.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedInquiry(item)}
                      className="py-4 flex justify-between items-center hover:bg-slate-50 px-2 rounded-lg cursor-pointer"
                    >
                      <span className="font-medium text-slate-800 flex-1 mr-4">
                        {item.title}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === "answered"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-white border border-slate-200 text-slate-500"
                        }`}
                      >
                        {item.status === "answered" ? "답변 완료" : "답변 대기"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      selectedInquiry.status === "answered"
                        ? "bg-brand-100 text-brand-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {selectedInquiry.status === "answered"
                      ? "답변 완료"
                      : "답변 대기"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedInquiry.date}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {selectedInquiry.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">
                  문의 내용
                </label>
                <div className="bg-slate-50 p-5 rounded-2xl text-slate-700 text-sm border">
                  {selectedInquiry.content}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">
                  답변 내용
                </label>
                <div
                  className={`p-5 rounded-2xl text-sm ${
                    selectedInquiry.answer
                      ? "bg-brand-50 text-slate-800 border border-brand-100"
                      : "bg-white border border-slate-200 text-slate-400 border-dashed"
                  }`}
                >
                  {selectedInquiry.answer || "아직 답변이 등록되지 않았습니다."}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-8 py-3 bg-[#5c5cff] text-white font-bold rounded-xl"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
