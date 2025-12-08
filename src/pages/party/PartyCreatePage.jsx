import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchProducts,
  createParty,
  processLeaderDeposit,
  updateOttAccount,
  fetchPartyDetail,
} from "../../hooks/party/partyService";
import { requestPayment } from "../../utils/paymentHandler";
import { useAuthStore } from "../../store/authStore";
import {
  Check,
  Calendar,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
} from "lucide-react";

export default function PartyCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [createdPartyId, setCreatedPartyId] = useState(null);
  const [ottInfo, setOttInfo] = useState({ ottId: "", ottPassword: "" });
  const [loading, setLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(!!searchParams.get("step"));
  const { user, loading: authLoading } = useAuthStore();

  // Step 0: Check Login Status
  useEffect(() => {
    if (!authLoading && !user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Step 1: Load Products & Check for Redirect Return
  useEffect(() => {
    if (user) {
      loadProducts();
      checkRedirectReturn();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      console.log("Loaded products:", data);
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Invalid products data format:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    }
  };

  const checkRedirectReturn = async () => {
    const stepParam = searchParams.get("step");
    const partyIdParam = searchParams.get("partyId");

    if (stepParam && partyIdParam) {
      try {
        const party = await fetchPartyDetail(partyIdParam);

        if (party) {
          setSelectedProduct({
            productId: party.productId,
            productName: party.productName || "Unknown Product",
            price: party.monthlyFee || 0,
          });
          setCreatedPartyId(Number(partyIdParam));
          setStep(Number(stepParam));
        }
      } catch (error) {
        console.error("Failed to restore party info", error);
        alert(
          "파티 정보를 불러오는 데 실패했습니다. 처음부터 다시 시도해주세요."
        );
        setStep(1);
      } finally {
        setIsRestoring(false);
      }
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setStep(2);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDates((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();
    if (!dates.startDate || !dates.endDate) {
      alert("시작일과 종료일을 모두 입력해주세요.");
      return;
    }
    setStep(3);
  };

  const handlePayment = async () => {
    if (!selectedProduct) return;
    setLoading(true);

    try {
      const partyData = {
        productId: selectedProduct.productId,
        maxMembers: 4,
        startDate: dates.startDate,
        endDate: dates.endDate,
        ottId: "",
        ottPassword: "",
      };

      let partyId = createdPartyId;

      if (!partyId) {
        const createdParty = await createParty(partyData);
        partyId = createdParty.partyId;
        setCreatedPartyId(partyId);
      }

      const amount = selectedProduct.price;

      localStorage.setItem(
        "pendingPayment",
        JSON.stringify({
          type: "CREATE_PARTY",
          partyId: partyId,
          partyData: partyData,
        })
      );

      await requestPayment(
        `${selectedProduct.productName} 파티 보증금`,
        amount,
        "방장"
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "결제 및 파티 생성 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleOttChange = (e) => {
    const { name, value } = e.target;
    setOttInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOttSubmit = async (e) => {
    e.preventDefault();
    if (!ottInfo.ottId || !ottInfo.ottPassword) {
      alert("OTT 아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await updateOttAccount(createdPartyId, ottInfo);
      alert("파티 생성이 완료되었습니다!");
      navigate(`/party/${createdPartyId}`);
    } catch (error) {
      console.error(error);
      alert("OTT 정보 저장에 실패했습니다.");
    }
  };

  const steps = [
    { number: 1, label: "상품 선택", icon: Sparkles },
    { number: 2, label: "기간 설정", icon: Calendar },
    { number: 3, label: "결제", icon: CreditCard },
    { number: 4, label: "계정 정보", icon: Lock },
  ];

  if (isRestoring) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#ea580c] border-t-transparent"></div>
          <p className="mt-4 text-lg text-stone-600 font-medium">
            결제 정보를 확인하고 있습니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-orange-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black text-center mb-3">
            파티 만들기
          </h1>
          <p className="text-center text-lg text-[#ffedd5] font-medium">
            몇 단계만 거치면 파티 생성이 완료됩니다
          </p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;

              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-emerald-500 shadow-lg"
                          : isActive
                          ? "bg-gradient-to-r from-[#ea580c] to-[#c2410c] shadow-lg scale-110"
                          : "bg-stone-200"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Icon
                          className={`w-6 h-6 ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        isActive || isCompleted
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 mt-[-24px] transition-all duration-300 ${
                        step > s.number
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Step 1: Product Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-3">
                  공유할 구독 상품을 선택하세요
                </h2>
                <p className="text-gray-600">
                  함께 사용할 OTT 서비스를 선택해주세요
                </p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 font-medium mb-2">
                    등록된 구독 상품이 없습니다
                  </p>
                  <p className="text-gray-500">관리자에게 문의해주세요</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.productId}
                      onClick={() => handleProductSelect(product)}
                      className="group relative bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 border-transparent hover:border-[#fdba74]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-stone-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.productName}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <Sparkles className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-black text-xl text-gray-900 mb-1">
                            {product.productName}
                          </h3>
                          <p className="text-2xl font-black text-[#ea580c]">
                            {product.price.toLocaleString()}
                            <span className="text-sm text-gray-600 font-normal ml-1">
                              원/월
                            </span>
                          </p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-stone-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date Selection */}
          {step === 2 && (
            <form onSubmit={handleDateSubmit} className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-3">
                  파티 기간을 설정하세요
                </h2>
                <p className="text-gray-600">
                  파티 시작일과 종료일을 선택해주세요
                </p>
              </div>

              <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-stone-200 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-stone-600" />
                  </div>
                  <div>
                    <p className="font-black text-xl text-gray-900">
                      {selectedProduct.productName}
                    </p>
                    <p className="text-lg font-bold text-[#ea580c]">
                      {selectedProduct.price.toLocaleString()}원/월
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    파티 시작일
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={dates.startDate}
                    onChange={handleDateChange}
                    className="w-full bg-stone-100 border-2 border-stone-200 p-4 rounded-xl focus:ring-2 focus:ring-[#fff7ed] focus:border-[#fff7ed] outline-none text-lg font-semibold transition-all"
                    required
                  />
                  <div className="mt-3 flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      매월 이 날짜에 파티원들의 결제가 진행됩니다
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    파티 종료일
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={dates.endDate}
                    onChange={handleDateChange}
                    className="w-full bg-stone-100 border-2 border-stone-200 p-4 rounded-xl focus:ring-2 focus:ring-[#fff7ed] focus:border-[#fff7ed] outline-none text-lg font-semibold transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  이전
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white rounded-xl font-black hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  다음
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-3">
                  보증금 결제
                </h2>
                <p className="text-gray-600">
                  파티 생성을 위한 보증금을 결제해주세요
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                  <span className="text-gray-600 font-semibold">상품</span>
                  <span className="font-black text-xl text-gray-900">
                    {selectedProduct.productName}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                  <span className="text-gray-600 font-semibold">파티 기간</span>
                  <span className="font-bold text-gray-900">
                    {dates.startDate} ~ {dates.endDate}
                  </span>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-xl font-black text-gray-900">
                    결제 금액 (보증금)
                  </span>
                  <span className="text-3xl font-black text-[#ea580c]">
                    {selectedProduct.price.toLocaleString()}
                    <span className="text-lg text-gray-600 font-normal ml-1">
                      원
                    </span>
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
                <div className="flex gap-3">
                  <Info className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div className="space-y-2 text-sm text-amber-900">
                    <p className="font-bold">보증금 안내</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>보증금은 파티 종료 시 전액 환급됩니다</li>
                      <li>
                        파티 생성 시 첫 달 구독료는 포함되지 않으며, 추후
                        정산됩니다
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  이전
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white rounded-xl font-black text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <CreditCard className="w-6 h-6" />
                  {loading ? "처리 중..." : "결제하고 파티 만들기"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: OTT Info */}
          {step === 4 && (
            <form onSubmit={handleOttSubmit} className="space-y-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3">
                  공유할 계정 정보 입력
                </h2>
                <p className="text-gray-600">
                  파티원들에게 공유할 계정 정보를 입력해주세요
                </p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8">
                <div className="flex gap-3">
                  <Check className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <p className="text-emerald-900 font-bold">
                    결제가 완료되었습니다! 파티원들에게 공유할 계정 정보를
                    입력해주세요.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <Lock className="w-4 h-4 inline mr-2" />
                    {selectedProduct?.productName || "상품"} 아이디 (이메일)
                  </label>
                  <input
                    type="text"
                    name="ottId"
                    value={ottInfo.ottId}
                    onChange={handleOttChange}
                    placeholder="example@email.com"
                    className="w-full bg-stone-100 border-2 border-stone-200 p-4 rounded-xl focus:ring-2 focus:ring-[#fff7ed] focus:border-[#fff7ed] outline-none text-lg font-semibold transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <Lock className="w-4 h-4 inline mr-2" />
                    {selectedProduct?.productName || "상품"} 비밀번호
                  </label>
                  <input
                    type="text"
                    name="ottPassword"
                    value={ottInfo.ottPassword}
                    onChange={handleOttChange}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full bg-stone-100 border-2 border-stone-200 p-4 rounded-xl focus:ring-2 focus:ring-[#fff7ed] focus:border-[#fff7ed] outline-none text-lg font-semibold transition-all"
                    required
                  />
                  <div className="mt-3 flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      파티원들에게만 공개되는 정보입니다. 정확하게 입력해주세요
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white rounded-xl font-black text-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <Check className="w-6 h-6" />
                저장하고 완료하기
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
