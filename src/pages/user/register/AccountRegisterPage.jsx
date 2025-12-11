import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import httpClient from "../../../api/httpClient";
import { useAuthStore } from "../../../store/authStore";

export default function AccountRegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuthStore();

  const [step, setStep] = useState(1); // 1: 시작, 2: 1원인증 입력, 3: 완료
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");

  // 로그인 체크
  useEffect(() => {
    if (!authLoading && !user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // 콜백에서 돌아온 경우 (step=2)
  useEffect(() => {
    let isMounted = true;

    const stepParam = searchParams.get("step");
    const errorParam = searchParams.get("error");
    const errorCode = searchParams.get("code");

    // 사용자가 취소한 경우 - 내지갑으로 돌아가기
    if (errorParam === "USER_CANCEL" || errorCode === "USER_CANCEL") {
      navigate("/user/wallet");
      return;
    }

    // 기타 에러
    if (errorParam) {
      setError(errorParam);
      setStep(1);
      return;
    }

    if (stepParam === "2") {
      setStep(2);
      // 1원 입금 자동 실행
      sendVerification();
    }

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // 오픈뱅킹 인증 시작
  const startAuth = async () => {
    // 오픈뱅킹 API 추후 개발 예정
    alert(
      "오픈뱅킹 계좌 연결 기능은 추후 개발 예정입니다.\n\n현재는 테스트 계좌로 등록됩니다."
    );
    setError("오픈뱅킹 API는 추후 개발 예정입니다.");

    /* 
        // 실제 오픈뱅킹 연동 시 사용할 코드
        setLoading(true);
        setError(null);
        try {
            const response = await httpClient.get("/openbanking/auth-url");
            const { authUrl } = response.data;
            // 오픈뱅킹 인증 페이지로 이동
            window.location.href = authUrl;
        } catch (err) {
            console.error("Auth URL error:", err);
            setError("오픈뱅킹 연결에 실패했습니다.");
            setLoading(false);
        }
        */
  };

  // 1원 인증 발송
  const sendVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      await httpClient.post("/openbanking/send-verification");
      setStep(2);
    } catch (err) {
      console.error("Send verification error:", err);
      setError(err.response?.data?.message || "1원 입금에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 인증 코드 검증
  const verifyCode = async () => {
    if (verificationCode.length !== 4) {
      setError("4자리 숫자를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await httpClient.post("/openbanking/verify", { code: verificationCode });
      setStep(3);
    } catch (err) {
      console.error("Verify error:", err);
      setError(err.response?.data?.message || "인증에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-6 py-5">
          <h1 className="text-xl font-bold text-gray-900">정산 계좌 등록</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        {/* Step 1: 시작 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                정산받을 계좌를 등록해주세요
              </h2>
              <p className="text-sm text-gray-500">
                오픈뱅킹을 통해 안전하게 계좌를 연결합니다.
                <br />
                1원 인증으로 본인 계좌를 확인합니다.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={startAuth}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  연결 중...
                </>
              ) : (
                "오픈뱅킹으로 계좌 연결하기"
              )}
            </button>

            <button
              onClick={() => navigate("/user/wallet")}
              className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              취소
            </button>
          </div>
        )}

        {/* Step 2: 1원 인증 */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">₩1</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">1원 인증</h2>
              <p className="text-sm text-gray-500">
                등록하신 계좌로 1원을 입금했습니다.
                <br />
                입금자명에서{" "}
                <span className="font-bold text-blue-600">숫자 4자리</span>를
                확인해주세요.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                예: 입금자명이 "MOA1234"이면, "1234" 입력
              </p>
            </div>

            <div>
              <input
                type="text"
                maxLength={4}
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                placeholder="숫자 4자리"
                className="w-full text-center text-2xl font-bold tracking-widest border-2 border-gray-200 rounded-xl py-4 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={verifyCode}
              disabled={loading || verificationCode.length !== 4}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  확인 중...
                </>
              ) : (
                "인증하기"
              )}
            </button>

            <button
              onClick={sendVerification}
              disabled={loading}
              className="w-full py-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              1원 재전송
            </button>
          </div>
        )}

        {/* Step 3: 완료 */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                계좌 등록 완료!
              </h2>
              <p className="text-sm text-gray-500">
                정산 계좌가 성공적으로 등록되었습니다.
              </p>
            </div>
            <button
              onClick={() => navigate("/user/wallet")}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
