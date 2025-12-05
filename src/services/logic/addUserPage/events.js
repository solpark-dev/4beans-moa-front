import { toBase64 } from "./image";
import { requestSignup, startPassAuth, verifyPassAuth } from "./api";

const BAD_WORDS = ["fuck", "shit", "bitch", "개새", "씨발", "병신", "지랄", "좆", "썅"];

export function bindSubmitEvent() {
  const btn = document.getElementById("btnSignup");

  if (btn && !btn.dataset.boundSubmit) {
    btn.addEventListener("click", async () => {
      // ... (앞부분 변수 가져오는 로직 생략, 기존과 동일) ...
      const searchParams = new URLSearchParams(window.location.search);
      const urlProvider = searchParams.get("provider");
      const urlProviderUserId = searchParams.get("providerUserId");
      const formProvider = document.getElementById("signupProvider")?.value;
      const formProviderUserId = document.getElementById("signupProviderUserId")?.value;
      const provider = urlProvider || formProvider || null;
      const providerUserId = urlProviderUserId || formProviderUserId || null;
      const isSocial = provider && providerUserId;
      const email = document.getElementById("signupEmail")?.value.trim() || null;
      const password = document.getElementById("signupPassword")?.value || null;
      const passwordCheck = document.getElementById("signupPasswordCheck")?.value || null;
      const nickname = document.getElementById("signupNickname").value.trim();
      const phone = document.getElementById("signupPhone").value.trim();
      const agreeMarketing = document.getElementById("agreeMarketing")?.checked ?? false;
      const imgInput = document.getElementById("signupProfileImage");

      const required = isSocial
        ? [ { el: nickname, msg: "닉네임을 입력하세요." }, { el: phone, msg: "휴대폰 번호를 입력하세요." } ]
        : [ { el: email, msg: "이메일을 입력하세요." }, { el: password, msg: "비밀번호를 입력하세요." }, { el: passwordCheck, msg: "비밀번호 확인을 입력하세요." }, { el: nickname, msg: "닉네임을 입력하세요." }, { el: phone, msg: "휴대폰 번호를 입력하세요." } ];

      for (const r of required) { if (!r.el) { alert(r.msg); return; } }
      if (!isSocial && password !== passwordCheck) { alert("비밀번호가 일치하지 않습니다."); return; }
      
      const lowerNickname = nickname.toLowerCase();
      for (const bad of BAD_WORDS) { if (lowerNickname.includes(bad)) { alert("닉네임에 부적절한 단어가 포함되어 있습니다."); document.getElementById("signupNickname").focus(); return; } }

      const ci = sessionStorage.getItem("PASS_CI");
      const di = sessionStorage.getItem("PASS_DI");
      if (!ci || !di) { alert("본인인증이 필요합니다."); return; }

      let base64 = null;
      if (imgInput && imgInput.files[0]) { base64 = await toBase64(imgInput.files[0]); }

      const payload = { userId: isSocial ? providerUserId : email, password: isSocial ? null : password, passwordConfirm: isSocial ? null : passwordCheck, nickname, phone, ci, di, agreeMarketing, profileImageBase64: base64, provider, providerUserId };

      try {
        const res = await requestSignup(payload);
        
        // ⚡ [디버깅] 콘솔에 res 객체 전체를 출력합니다.
        console.log("🔥 [DEBUG] 회원가입 응답:", res);

        // 🛡️ [만능 조건문] res.success 또는 res.data.success 둘 중 하나라도 true면 성공으로 간주
        const isSuccess = (res && res.success === true) || (res && res.data && res.data.success === true);

        if (isSuccess) {
          alert("회원가입이 완료되었습니다.");
          window.location.href = "/login";
        } else {
          // 실패 메시지 추출 로직 강화
          let errorMsg = "회원가입 실패";
          if (res && res.error && res.error.message) errorMsg = res.error.message;
          else if (res && res.data && res.data.message) errorMsg = res.data.message;
          else if (res && res.message) errorMsg = res.message;
          
          console.log("🔥 [DEBUG] 실패 원인:", errorMsg);
          alert(errorMsg);
        }
      } catch (err) {
        console.error("🔥 [DEBUG] 에러 발생:", err);
        const msg = err.response?.data?.error?.message || err.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
        alert(msg);
      }
    });

    btn.dataset.boundSubmit = "true";
  }

  const passBtn = document.getElementById("btnPhoneVerify");
  const phoneInput = document.getElementById("signupPhone");
  const msgPhone = document.getElementById("msgPhone");

  if (passBtn && !passBtn.dataset.boundPass) {
    passBtn.addEventListener("click", async () => {
      try {
        const { impCode, merchantUid } = await startPassAuth();
        if (!window.IMP) { alert("인증 모듈 로드 실패"); return; }
        window.IMP.init(impCode);
        window.IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
          if (!rsp.success) return;
          const data = await verifyPassAuth(rsp.imp_uid);
          phoneInput.value = data.phone;
          phoneInput.readOnly = true;
          sessionStorage.setItem("PASS_CI", data.ci);
          sessionStorage.setItem("PASS_DI", data.di);
          msgPhone.textContent = "본인인증 성공!";
          msgPhone.className = "text-xs text-green-600";
        });
      } catch (err) { alert("본인인증 오류"); }
    });
    passBtn.dataset.boundPass = "true";
  }
}