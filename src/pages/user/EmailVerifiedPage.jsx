import { useEffect, useState } from "react";
import axios from "axios";

export default function EmailVerifiedPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("잘못된 접근입니다. 토큰이 없습니다.");
      return;
    }

    axios
      .get(`/api/uses/verify-email?token=${token}`)
      .then(() => {
        setStatus("success");
        setMessage("이메일 인증이 완료되었습니다! 이제 로그인할 수 있습니다.");
      })
      .catch((err) => {
        console.log(err);
        setStatus("error");
        setMessage(
          err.response?.data?.error?.message ||
            "이메일 인증에 실패했습니다. 다시 시도해 주세요."
        );
      });
  }, []);

  return (
    <div className="flex flex-col items-center pt-40 px-5 text-center">
      {status === "loading" && (
        <h2 className="text-xl font-bold text-gray-700">이메일 인증 처리 중...</h2>
      )}

      {status === "success" && (
        <>
          <h2 className="text-2xl font-bold mb-5 text-green-600">인증 완료!</h2>
          <p className="mb-8 text-gray-700">{message}</p>
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg"
          >
            로그인하러 가기
          </a>
        </>
      )}

      {status === "error" && (
        <>
          <h2 className="text-2xl font-bold mb-5 text-red-600">인증 실패</h2>
          <p className="mb-8 text-gray-700">{message}</p>
          <a
            href="/login"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg text-lg"
          >
            로그인 페이지로 이동
          </a>
        </>
      )}
    </div>
  );
}
