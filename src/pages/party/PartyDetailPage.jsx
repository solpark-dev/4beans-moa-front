import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchPartyDetail,
  fetchPartyMembers,
  joinParty,
  leaveParty,
} from "../../services/partyService";
import { requestPayment } from "../../services/paymentService";
import LeavePartyWarningModal from "../../components/party/LeavePartyWarningModal";
import UpdateOttModal from "../../components/party/UpdateOttModal";
import { Eye, EyeOff, Edit2 } from "lucide-react";

export default function PartyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [party, setParty] = useState(null);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Modals state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isOttModalOpen, setIsOttModalOpen] = useState(false);

  // OTT visibility state
  const [showOttInfo, setShowOttInfo] = useState(false);

  useEffect(() => {
    loadData();
    const userStr = localStorage.getItem("moa_user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, [id]);

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
      // 1. 결제 요청 (보증금 + 첫 달 구독료)
      // 인당 월 구독료 = 전체 구독료 / 최대 인원
      const perPersonFee = Math.floor(party.monthlyFee / party.maxMembers);
      const totalAmount = perPersonFee * 2;

      const paymentData = await requestPayment(
        `${party.productName} 파티 가입`,
        totalAmount,
        currentUser.nickname
      );

      // 2. 서버에 가입 요청
      await joinParty(id, {
        tossPaymentKey: paymentData.paymentKey,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        paymentMethod: "CARD",
      });

      alert("파티 가입이 완료되었습니다!");
      loadData(); // 데이터 갱신
    } catch (error) {
      console.error(error);
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

  if (!party) return <p>불러오는 중…</p>;

  const isMember = members.some((m) => m.userId === currentUser?.userId);
  const isLeader = party.partyLeaderId === currentUser?.userId;
  const isFull = party.currentMembers >= party.maxMembers;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{party.productName} 파티</h1>
              <p className="mt-2 text-gray-600">
                방장: {party.leaderNickname}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                월 {party.monthlyFee.toLocaleString()}원
              </p>
              <p className="text-sm text-gray-500">
                (보증금: {party.monthlyFee.toLocaleString()}원)
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">파티 정보</h3>
                <ul className="space-y-2">
                  <li>
                    상태:{" "}
                    <span
                      className={`font-bold ${party.partyStatus === "RECRUITING"
                        ? "text-green-600"
                        : "text-gray-600"
                        }`}
                    >
                      {party.partyStatus}
                    </span>
                  </li>
                  <li>
                    인원: {party.currentMembers} / {party.maxMembers}명
                  </li>
                  <li>시작일: {party.startDate}</li>
                </ul>
              </div>

              {/* OTT 계정 정보 섹션 (멤버 또는 방장만 보임) */}
              {(isMember || isLeader) && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800">OTT 계정 정보</h3>
                    {isLeader && (
                      <button
                        onClick={() => setIsOttModalOpen(true)}
                        className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Edit2 className="w-3 h-3" /> 수정
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-100">
                      <span className="text-gray-500 w-16">아이디</span>
                      <div className="flex-1 text-right font-mono">
                        {showOttInfo ? (
                          party.ottId || <span className="text-gray-400 italic">미등록</span>
                        ) : (
                          "*****"
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-100">
                      <span className="text-gray-500 w-16">비밀번호</span>
                      <div className="flex-1 text-right font-mono">
                        {showOttInfo ? (
                          party.ottPassword || <span className="text-gray-400 italic">미등록</span>
                        ) : (
                          "*****"
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowOttInfo(!showOttInfo)}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
                    >
                      {showOttInfo ? (
                        <><EyeOff className="w-4 h-4" /> 정보 숨기기</>
                      ) : (
                        <><Eye className="w-4 h-4" /> 정보 보기</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">멤버 리스트</h3>
              <ul className="space-y-2">
                {members.map((member) => (
                  <li key={member.partyMemberId} className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                    <span>{member.nickname}</span>
                    {member.role === "LEADER" && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        방장
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            {!isMember && !isLeader && !isFull && (
              <button
                onClick={handleJoin}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                파티 가입하기 (결제)
              </button>
            )}
            {isMember && !isLeader && (
              <button
                className="bg-red-100 text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-200 transition"
                onClick={() => setIsLeaveModalOpen(true)}
              >
                파티 탈퇴하기
              </button>
            )}
            {isFull && !isMember && (
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-bold cursor-not-allowed"
              >
                모집 마감
              </button>
            )}
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
    </div>
  );
}
