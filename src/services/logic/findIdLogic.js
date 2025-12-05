import { useState } from "react";
import httpClient from "@/api/httpClient";

export const useFindId = () => {
  const [step, setStep] = useState(1);
  const [foundEmail, setFoundEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePassAuth = async () => {
    try {
      setIsLoading(true);

      const mockResponse = {
        imp_uid: "imp_1234567890",
        success: true,
      };

      if (!mockResponse.success) {
        alert("본인 인증에 실패했습니다.");
        return;
      }

      const verifyRes = await httpClient.post("/users/pass/verify", {
        imp_uid: mockResponse.imp_uid,
      });

      const { phone } = verifyRes.data.data;

      const findIdRes = await httpClient.post("/users/find-id", {
        phone: phone,
      });

      const { email } = findIdRes.data.data;

      setFoundEmail(email);
      setStep(2);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("해당 번호로 가입된 이메일이 존재하지 않습니다.");
      } else {
        alert("이메일 찾기 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    foundEmail,
    isLoading,
    handlePassAuth,
  };
};
