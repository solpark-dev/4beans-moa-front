import httpClient from "@/api/httpClient";

export function initFindIdPage() {
  const passButton = document.getElementById("btnPassAuth");
  const emailInput = document.getElementById("findIdEmail");
  const guideText = document.getElementById("findIdGuide");
  const goLoginButton = document.getElementById("btnGoLogin");
  const step1 = document.getElementById("findIdStep1");
  const step2 = document.getElementById("findIdStep2");

  if (!passButton || !emailInput) {
    return;
  }

  passButton.addEventListener("click", async () => {
    try {
      // TODO: PORTONE PASS 본인인증 실제 연동
      // ex) await window.IMP.certification(...)

      // TODO: 본인인증 결과를 이용해 서버에 이메일 조회
      // const res = await axios.post("/api/users/find-id", { name, phone, birth });
      // const { success, data } = res.data;

      const dummyEmail = "moa@gmail.com";
      const success = true;
      const data = { email: dummyEmail };

      if (!success || !data?.email) {
        alert("가입된 이메일을 찾을 수 없습니다.");
        return;
      }

      if (guideText) {
        guideText.classList.add("hidden");
      }

      // 단계 진행 UI 변경
      if (step1 && step2) {
        step1.classList.remove("text-blue-600");
        step1.classList.add("text-gray-400");

        step2.classList.remove("text-gray-400");
        step2.classList.add("text-blue-600");
      }

      emailInput.value = data.email;
      emailInput.classList.remove("hidden");

      if (goLoginButton) {
        goLoginButton.classList.remove("hidden");
      }
    } catch (err) {
      alert("이메일 찾기 중 오류가 발생했습니다.");
    }
  });
}
