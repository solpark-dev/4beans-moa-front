import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchPartyDetail,
  fetchPartyMembers,
  joinParty,
  leaveParty,
} from "../../services/partyService";
import { requestPayment } from "../../services/paymentService";


export default function PartyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [party, setParty] = useState(null);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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
      // 보증금 = 월 구독료, 첫 달 구독료 = 월 구독료 -> 총 2개월치
      const totalAmount = party.monthlyFee * 2;
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

  const handleLeave = async () => {
    if (!window.confirm("정말로 파티를 탈퇴하시겠습니까? 보증금은 환불됩니다.")) {
      return;
    }

    try {
      await leaveParty(id);
      alert("파티에서 탈퇴했습니다.");
      loadData(); // 데이터 갱신 (또는 목록으로 이동)
    } catch (error) {
      console.error(error);
      alert("파티 탈퇴에 실패했습니다.");
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

          <div className="mt-8 grid grid-cols-2 gap-8">
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
                onClick={handleLeave}
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
    </div>
  );
}
