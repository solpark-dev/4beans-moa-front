import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    fetchProducts,
    createParty,
    processLeaderDeposit,
    updateOttAccount,
    fetchPartyDetail,
} from "../../services/partyService";
import { requestPayment } from "../../services/paymentService";
import { useAuthStore } from "../../store/authStore";


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
    // 리다이렉트 복귀 시 데이터 복구 중인지 여부
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
        if (user) { // Only load if user exists
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
                // 파티 정보 조회하여 선택된 상품 정보 복구
                const party = await fetchPartyDetail(partyIdParam);

                if (party) {
                    setSelectedProduct({
                        productId: party.productId,
                        productName: party.productName || "Unknown Product",
                        price: party.monthlyFee || 0, // 보증금 = 월구독료
                    });
                    setCreatedPartyId(Number(partyIdParam));
                    setStep(Number(stepParam));
                }
            } catch (error) {
                console.error("Failed to restore party info", error);
                alert("파티 정보를 불러오는 데 실패했습니다. 처음부터 다시 시도해주세요.");
                setStep(1);
            } finally {
                setIsRestoring(false);
            }
        }
    };

    // Handlers
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

            // 1. 파티가 아직 생성되지 않았다면 생성
            if (!partyId) {
                const createdParty = await createParty(partyData);
                partyId = createdParty.partyId;
                setCreatedPartyId(partyId);
            }

            // 2. 결제 요청 (보증금 = 월 구독료)
            const amount = selectedProduct.price;

            // 결제 전 상태 저장 (리다이렉트 후 복귀를 위해)
            localStorage.setItem("pendingPayment", JSON.stringify({
                type: "CREATE_PARTY",
                partyId: partyId,
                partyData: partyData // DB 초기화 대비 데이터 저장
            }));

            await requestPayment(
                `${selectedProduct.productName} 파티 보증금`,
                amount,
                "방장"
            );

            // 리다이렉트 되므로 아래 코드는 실행되지 않을 수 있음.
            // 하지만 팝업 방식일 경우를 대비해 남겨둘 수 있으나, 
            // 현재 로직은 PaymentSuccessPage에서 처리하도록 변경됨.
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

    if (isRestoring) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <main className="flex-1 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">결제 정보를 확인하고 있습니다...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
                <div className="bg-white shadow-lg rounded-xl p-8">
                    <h1 className="text-3xl font-bold mb-8 text-center">파티 만들기</h1>

                    {/* Progress Bar */}
                    <div className="flex justify-between mb-10 text-sm font-medium text-gray-500">
                        <span className={step >= 1 ? "text-blue-600 font-bold" : ""}>
                            1. 상품 선택
                        </span>
                        <span className={step >= 2 ? "text-blue-600 font-bold" : ""}>
                            2. 기간 설정
                        </span>
                        <span className={step >= 3 ? "text-blue-600 font-bold" : ""}>
                            3. 결제
                        </span>
                        <span className={step >= 4 ? "text-blue-600 font-bold" : ""}>
                            4. 계정 정보
                        </span>
                    </div>

                    {/* Step 1: Product Selection */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">공유할 구독 상품을 선택하세요</h2>
                            {products.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 bg-gray-100 rounded-lg">
                                    <p>등록된 구독 상품이 없습니다.</p>
                                    <p className="text-sm mt-2">관리자에게 문의해주세요.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.map((product) => (
                                        <div
                                            key={product.productId}
                                            onClick={() => handleProductSelect(product)}
                                            className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition flex items-center space-x-4"
                                        >
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0">
                                                {/* 이미지 있으면 표시 */}
                                                {product.image && (
                                                    <img
                                                        src={product.image}
                                                        alt={product.productName}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{product.productName}</h3>
                                                <p className="text-gray-600">
                                                    월 {product.price.toLocaleString()}원
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Date Selection */}
                    {step === 2 && (
                        <form onSubmit={handleDateSubmit} className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">파티 기간을 설정하세요</h2>
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <p className="font-bold text-blue-800">
                                    선택한 상품: {selectedProduct.productName}
                                </p>
                                <p className="text-blue-600">
                                    월 구독료: {selectedProduct.price.toLocaleString()}원
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">파티 시작일</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={dates.startDate}
                                    onChange={handleDateChange}
                                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    * 매월 이 날짜에 파티원들의 결제가 진행됩니다.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">파티 종료일</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={dates.endDate}
                                    onChange={handleDateChange}
                                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    이전
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                                >
                                    다음
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">보증금 결제</h2>
                            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-8">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">상품</span>
                                    <span className="font-bold">{selectedProduct.productName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">기간</span>
                                    <span className="font-bold">
                                        {dates.startDate} ~ {dates.endDate}
                                    </span>
                                </div>
                                <div className="border-t pt-4 flex justify-between text-lg">
                                    <span className="font-bold">결제 금액 (보증금)</span>
                                    <span className="font-bold text-blue-600">
                                        {selectedProduct.price.toLocaleString()}원
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    * 보증금은 파티 종료 시 환급됩니다.
                                    <br />* 파티 생성 시 첫 달 구독료는 포함되지 않으며, 추후 정산됩니다.
                                </p>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(2)}
                                    className="text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    이전
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                                >
                                    {loading ? "처리 중..." : "결제하고 파티 만들기"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: OTT Info */}
                    {step === 4 && (
                        <form onSubmit={handleOttSubmit} className="space-y-6">
                            <h2 className="text-xl font-bold mb-4">공유할 계정 정보 입력</h2>
                            <div className="bg-green-50 p-4 rounded-lg mb-6 text-green-800">
                                결제가 완료되었습니다! 파티원들에게 공유할 계정 정보를 입력해주세요.
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {selectedProduct?.productName || "상품"} 아이디 (이메일)
                                </label>
                                <input
                                    type="text"
                                    name="ottId"
                                    value={ottInfo.ottId}
                                    onChange={handleOttChange}
                                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {selectedProduct?.productName || "상품"} 비밀번호
                                </label>
                                <input
                                    type="text" // 비밀번호 공유 목적이므로 보이게 하는 게 나을 수도 있음, 일단 text로
                                    name="ottPassword"
                                    value={ottInfo.ottPassword}
                                    onChange={handleOttChange}
                                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    * 파티원들에게만 공개되는 정보입니다. 정확하게 입력해주세요.
                                </p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                                >
                                    저장하고 완료하기
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
