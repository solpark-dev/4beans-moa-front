import { useState } from "react";
import httpClient from "@/api/httpClient";

export const useFindId = () => {
  const [step, setStep] = useState(1);
  const [foundEmail, setFoundEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePassAuth = async () => {
    try {
      setIsLoading(true);

      const startRes = await httpClient.get("/users/pass/start");
      const { impCode, merchantUid } = startRes.data;
      const { IMP } = window;
      if (!IMP) {
        alert("인증 모듈을 불러오지 못했습니다.");
        setIsLoading(false);
        return;
      }

      IMP.init(impCode);
      IMP.certification(
        {
          merchant_uid: merchantUid,
          popup: false,
        },
        async (rsp) => {
          if (rsp.success) {
            try {
              // 1. 본인인증 결과 검증
              const verifyRes = await httpClient.post("/users/pass/verify", {
                imp_uid: rsp.imp_uid,
              });

              const { phone } = verifyRes.data;

              // 2. 아이디 찾기 요청
              const findIdRes = await httpClient.post("/users/find-id", {
                phone: phone,
              });

              console.log("findIdRes 데이터 확인:", findIdRes.data);

              // [수정 완료] 서버 로그에 찍힌 키값인 'email'로 복구
              const { email } = findIdRes.data;

              // email 값이 존재하면 상태 업데이트
              if (email) {
                setFoundEmail(email);
                setStep(2);
              } else {
                alert("가입된 아이디 정보를 찾을 수 없습니다.");
              }
            } catch (error) {
              console.error(error);
              if (error.response && error.response.status === 404) {
                alert("해당 번호로 가입된 아이디가 존재하지 않습니다.");
              } else {
                alert("인증 정보 확인 중 오류가 발생했습니다.");
              }
            } finally {
              setIsLoading(false);
            }
          } else {
            alert(`인증에 실패하였습니다. ${rsp.error_msg || ""}`);
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      console.error(error);
      alert("인증 초기화 중 오류가 발생했습니다.");
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
