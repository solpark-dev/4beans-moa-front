// src/services/logic/addUserPage/events.js
import { toBase64 } from "./image";
import { requestSignup, startPassAuth, verifyPassAuth } from "./api";

export function bindSubmitEvent() {
  const btn = document.getElementById("btnSignup");

  if (btn && !btn.dataset.boundSubmit) {
    btn.addEventListener("click", async () => {
      const provider = document.getElementById("signupProvider")?.value || null;
      const providerUserId =
        document.getElementById("signupProviderUserId")?.value || null;
      const isSocial = provider && providerUserId;

      const email =
        document.getElementById("signupEmail")?.value.trim() || null;
      const password = document.getElementById("signupPassword")?.value || null;
      const passwordCheck =
        document.getElementById("signupPasswordCheck")?.value || null;

      const nickname = document.getElementById("signupNickname").value.trim();
      const phone = document.getElementById("signupPhone").value.trim();
      const agreeMarketing =
        document.getElementById("agreeMarketing")?.checked ?? false;

      const imgInput = document.getElementById("signupProfileImage");

      const required = isSocial
        ? [
            { el: nickname, msg: "닉네임을 입력하세요." },
            { el: phone, msg: "휴대폰 번호를 입력하세요." },
          ]
        : [
            { el: email, msg: "이메일을 입력하세요." },
            { el: password, msg: "비밀번호를 입력하세요." },
            { el: passwordCheck, msg: "비밀번호 확인을 입력하세요." },
            { el: nickname, msg: "닉네임을 입력하세요." },
            { el: phone, msg: "휴대폰 번호를 입력하세요." },
          ];

      for (const r of required) {
        if (!r.el) {
          alert(r.msg);
          return;
        }
      }

      if (!isSocial && password !== passwordCheck) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      const ci = sessionStorage.getItem("PASS_CI");
      const di = sessionStorage.getItem("PASS_DI");

      if (!ci || !di) {
        alert("본인인증이 필요합니다.");
        return;
      }

      let base64 = null;
      if (imgInput && imgInput.files[0]) {
        base64 = await toBase64(imgInput.files[0]);
      }

      const payload = {
        userId: isSocial ? null : email,
        password: isSocial ? null : password,
        passwordConfirm: isSocial ? null : passwordCheck,
        nickname,
        phone,
        ci,
        di,
        agreeMarketing,
        profileImageBase64: base64,
        provider,
        providerUserId,
      };

      try {
        const res = await requestSignup(payload);
        if (res.success) {
          alert("회원가입 완료되었습니다.");
          window.location.href = "/login";
        } else {
          alert(res.error?.message || "회원가입 실패");
        }
      } catch (err) {
        alert(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "회원가입 중 오류 발생"
        );
      }
    });

    btn.dataset.boundSubmit = "true";
  }

  // ============================
  // 🔥 PASS 인증 바인딩
  // ============================

  const passBtn = document.getElementById("btnPhoneVerify");
  const phoneInput = document.getElementById("signupPhone");
  const msgPhone = document.getElementById("msgPhone");

  if (passBtn && !passBtn.dataset.boundPass) {
    passBtn.addEventListener("click", async () => {
      try {
        const { impCode, merchantUid } = await startPassAuth();

        if (!window.IMP) {
          alert("본인인증 모듈이 로드되지 않았습니다.");
          return;
        }

        window.IMP.init(impCode);

        window.IMP.certification(
          {
            merchant_uid: merchantUid,
          },
          async (rsp) => {
            if (!rsp.success) {
              return;
            }

            const data = await verifyPassAuth(rsp.imp_uid);

            phoneInput.value = data.phone;
            phoneInput.readOnly = true;

            sessionStorage.setItem("PASS_CI", data.ci);
            sessionStorage.setItem("PASS_DI", data.di);

            msgPhone.textContent = "본인인증 성공!";
            msgPhone.className = "text-xs text-green-600";
          }
        );
      } catch (err) {
        console.log(err);
        alert("본인인증 요청 오류 발생");
      }
    });

    passBtn.dataset.boundPass = "true";
  }
}
