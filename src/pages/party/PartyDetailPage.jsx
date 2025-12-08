import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchPartyDetail,
  fetchPartyMembers,
  joinParty,
  leaveParty,
} from "../../services/partyService";
import { requestPayment } from "../../services/paymentService";
import { fetchCurrentUser } from "../../api/authApi";
import LeavePartyWarningModal from "../../components/party/LeavePartyWarningModal";
import UpdateOttModal from "../../components/party/UpdateOttModal";
import {
  Eye,
  EyeOff,
  Edit2,
  Users,
  Calendar,
  Crown,
  Shield,
  CreditCard,
  ArrowLeft,
  UserPlus,
  UserMinus,
  Lock,
  Check,
} from "lucide-react";

export default function PartyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [party, setParty] = useState(null);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Modals state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isOttModalOpen, setIsOttModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // OTT visibility state
  const [showOttInfo, setShowOttInfo] = useState(false);

  useEffect(() => {
    loadData();
    loadCurrentUser();
  }, [id]);

  const loadCurrentUser = async () => {
    try {
      const userData = await fetchCurrentUser();
      if (userData && userData.data) {
        setCurrentUser(userData.data);
      }
    } catch (error) {
      console.error("Failed to load current user", error);
      setCurrentUser(null);
    }
  };

  const loadData = async () => {
    try {
      const partyData = await fetchPartyDetail(id);
      setParty(partyData);
      const membersData = await fetchPartyMembers(id);
      setMembers(membersData);
    } catch (error) {
      console.error("Failed to load party data", error);
    }
  };

  const handleJoin = async () => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // 1. 결제 정보 준비 (보증금 + 첫 달 구독료)
      // monthlyFee는 이미 인당 금액으로 저장됨
      const perPersonFee = party.monthlyFee;
      const totalAmount = perPersonFee * 2;

      // 2. localStorage에 결제 정보 저장 (결제 성공 후 사용)
      localStorage.setItem(
        "pendingPayment",
        JSON.stringify({
          type: "JOIN_PARTY",
          partyId: id,
        })
      );

      // 3. Toss Payments 결제 요청 (성공 시 /payment/success로 리다이렉트)
      await requestPayment(
        `${party.productName} 파티 가입`,
        totalAmount,
        currentUser.nickname
      );
    } catch (error) {
      console.error(error);
      localStorage.removeItem("pendingPayment");
      alert(error.message || "파티 가입에 실패했습니다.");
    }
  };

  const handleLeaveConfirm = async () => {
    try {
      await leaveParty(id);
      alert("파티에서 탈퇴했습니다.");
      navigate("/my-parties"); // 목록으로 이동
    } catch (error) {
      console.error(error);
      alert("파티 탈퇴에 실패했습니다. (백엔드 미구현일 수 있음)");
    } finally {
      setIsLeaveModalOpen(false);
    }
  };

  if (!party) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#ea580c] border-t-transparent"></div>
          <p className="mt-4 text-lg text-stone-600 font-medium">
            파티 정보 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  const isMember = members.some((m) => m.userId === currentUser?.userId);
  const isLeader = party.partyLeaderId === currentUser?.userId;
  const isFull = party.currentMembers >= party.maxMembers;
  // monthlyFee는 이미 인당 금액으로 저장됨
  const perPersonFee = party.monthlyFee;
  const depositAmount = perPersonFee;
  const firstPayment = perPersonFee * 2;
  const availableSlots = party.maxMembers - party.currentMembers;

  const getStatusBadge = (status) => {
    const badges = {
      RECRUITING: {
        bg: "bg-[#ffedd5] text-[#c2410c]",
        text: "모집중",
        icon: "✨",
      },
      ACTIVE: {
        bg: "bg-emerald-100 text-emerald-700",
        text: "진행중",
        icon: "🚀",
      },
      PENDING_PAYMENT: {
        bg: "bg-amber-100 text-amber-700",
        text: "결제대기",
        icon: "⏳",
      },
      CLOSED: {
        bg: "bg-stone-100 text-stone-500",
        text: "종료",
        icon: "🔒",
      },
    };
    return badges[status] || badges.RECRUITING;
  };

  const badge = getStatusBadge(party.partyStatus);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Header */}
      <div className="bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950 to-stone-900 opacity-90"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#fff7ed] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate("/party")}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">파티 목록으로</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-4 py-2 ${badge.bg} text-sm font-bold rounded-full shadow-lg`}
                >
                  {badge.icon} {badge.text}
                </span>
                {isLeader && (
                  <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold rounded-full shadow-lg">
                    <Crown className="w-4 h-4" /> 파티장
                  </span>
                )}
                {isMember && !isLeader && (
                  <span className="inline-flex items-center gap-1 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full">
                    <Check className="w-4 h-4" /> 파티원
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                {party.productName}
              </h1>
              <p className="text-xl text-[#ffedd5] font-medium">
                방장: {party.leaderNickname}
              </p>
            </div>

            {/* Pricing Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl min-w-[280px]">
              <p className="text-sm text-[#ffedd5] mb-2">인당 월 구독료</p>
              <p className="text-4xl font-black mb-4">
                {perPersonFee.toLocaleString()}
                <span className="text-xl text-[#ffedd5] font-normal ml-2">
                  원
                </span>
              </p>
              <div className="bg-white/10 rounded-xl p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#ffedd5]">보증금</span>
                  <span className="font-bold">
                    {depositAmount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ffedd5]">첫 달 구독료</span>
                  <span className="font-bold">
                    {perPersonFee.toLocaleString()}원
                  </span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-2 flex justify-between">
                  <span className="text-[#ffedd5] font-semibold">
                    첫 결제 금액
                  </span>
                  <span className="font-black text-lg">
                    {firstPayment.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Party Info & OTT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Party Info Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-2">
                <Shield className="w-7 h-7 text-[#ea580c]" />
                파티 정보
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Members Status */}
                <div className="bg-stone-100 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-stone-600 mb-3">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">참여 인원</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex -space-x-2">
                      {[...Array(party.currentMembers)].map((_, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-stone-400 border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-md"
                        >
                          {i + 1}
                        </div>
                      ))}
                      {[...Array(availableSlots)].map((_, i) => (
                        <div
                          key={`empty-${i}`}
                          className="w-10 h-10 rounded-full bg-stone-200 border-3 border-white flex items-center justify-center shadow-md"
                        >
                          <span className="text-stone-400 text-sm">+</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-2xl font-black text-stone-900">
                      {party.currentMembers}/{party.maxMembers}
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#fff7ed] h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(party.currentMembers / party.maxMembers) * 100
                          }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Start Date & End Date */}
                <div className="bg-stone-100 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-stone-600 mb-3">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">파티 기간</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-500 w-16">시작일</span>
                      <p className="text-2xl font-black text-stone-900">
                        {party.startDate?.split("T")[0] || party.startDate?.split(" ")[0] || "-"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-500 w-16">종료일</span>
                      <p className="text-2xl font-black text-stone-900">
                        {party.endDate ? (party.endDate.split("T")[0] || party.endDate.split(" ")[0]) : "미정"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OTT Account Info Card */}
            {(isMember || isLeader) && (
              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                    <Lock className="w-7 h-7 text-[#ea580c]" />
                    OTT 계정 정보
                  </h2>
                  {isLeader && (
                    <button
                      onClick={() => setIsOttModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#ea580c] text-white rounded-2xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                      수정
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-500">
                        아이디
                      </span>
                      {!showOttInfo && (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="font-mono text-lg font-bold text-gray-900">
                      {showOttInfo ? (
                        party.ottId || (
                          <span className="text-gray-400 italic text-base font-normal">
                            미등록
                          </span>
                        )
                      ) : (
                        <span className="blur-sm select-none">
                          example@email.com
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-500">
                        비밀번호
                      </span>
                      {!showOttInfo && (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="font-mono text-lg font-bold text-gray-900">
                      {showOttInfo ? (
                        party.ottPassword || (
                          <span className="text-gray-400 italic text-base font-normal">
                            미등록
                          </span>
                        )
                      ) : (
                        <span className="blur-sm select-none">
                          ••••••••••••
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowOttInfo(!showOttInfo)}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#ea580c] text-white rounded-2xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    {showOttInfo ? (
                      <>
                        <EyeOff className="w-5 h-5" />
                        정보 숨기기
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        정보 보기
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Members List & Actions */}
          <div className="space-y-6">
            {/* Members List Card (Leader Only) */}
            {isLeader && (
              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow sticky top-6">
                <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-2">
                  <Users className="w-7 h-7 text-[#ea580c]" />
                  멤버 리스트
                </h2>
                <div className="space-y-3">
                  {members.map((member, index) => (
                    <div
                      key={member.partyMemberId}
                      className="flex items-center gap-3 p-4 bg-stone-100 rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-12 h-12 bg-stone-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-stone-900">
                          {member.nickname}
                        </p>
                        {member.role === "LEADER" && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full font-bold">
                            <Crown className="w-3 h-3" />
                            방장
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Empty Slots */}
                  {[...Array(availableSlots)].map((_, i) => (
                    <div
                      key={`empty-slot-${i}`}
                      className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border-2 border-dashed border-stone-300"
                    >
                      <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center">
                        <UserPlus className="w-6 h-6 text-stone-400" />
                      </div>
                      <p className="text-stone-400 font-medium">
                        모집 대기중...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-3xl shadow-lg p-8 space-y-4 sticky top-6">
              {!isMember && !isLeader && !isFull && (
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#ea580c] text-white rounded-2xl font-black text-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                >
                  <CreditCard className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  파티 가입하기
                </button>
              )}

              {isMember && !isLeader && (
                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-red-500 text-white rounded-2xl font-black text-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                >
                  <UserMinus className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  파티 탈퇴하기
                </button>
              )}

              {isFull && !isMember && (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-4 bg-stone-200 text-stone-400 rounded-2xl font-black text-lg cursor-not-allowed"
                >
                  <Lock className="w-6 h-6" />
                  모집 마감
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LeavePartyWarningModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveConfirm}
      />

      <UpdateOttModal
        isOpen={isOttModalOpen}
        onClose={(success) => {
          setIsOttModalOpen(false);
          if (success) loadData();
        }}
        partyId={id}
        currentOttId={party.ottId}
      />

      {/* Join Confirmation Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform transition-all">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fff7ed] mb-4">
                <UserPlus className="w-8 h-8 text-[#ea580c]" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                파티 가입 안내
              </h3>
              <p className="text-stone-600">
                파티 가입 시 다음 절차가 진행됩니다
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 mb-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">보증금 + 첫 달 구독료 결제</p>
                  <p className="text-sm text-stone-600 mt-1">
                    총 {firstPayment.toLocaleString()}원 (보증금 {depositAmount.toLocaleString()}원 + 첫 달 구독료 {perPersonFee.toLocaleString()}원)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">월 구독료 자동 결제 설정</p>
                  <p className="text-sm text-stone-600 mt-1">
                    매월 {party.paymentDay}일에 {perPersonFee.toLocaleString()}원이 자동 결제됩니다
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-amber-800 font-medium">
                ℹ️ 보증금은 파티 탈퇴 시 환불됩니다
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setIsJoinModalOpen(false);
                  handleJoin();
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#ea580c] to-[#c2410c] hover:shadow-lg text-white rounded-xl font-bold transition-all"
              >
                가입하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
