import httpClient from "@/api/httpClient";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function initSignupPage() {
  const emailInput = document.getElementById("signupEmail");
  const nicknameInput = document.getElementById("signupNickname");
  const phoneInput = document.getElementById("signupPhone");
  const passwordInput = document.getElementById("signupPassword");
  const passwordCheckInput = document.getElementById("signupPasswordCheck");

  const msgEmail = document.getElementById("msgEmail");
  const msgNickname = document.getElementById("msgNickname");
  const msgPhone = document.getElementById("msgPhone");
  const msgPassword = document.getElementById("msgPassword");
  const msgPasswordCheck = document.getElementById("msgPasswordCheck");

  const fileInput = document.getElementById("signupProfileImage");
  const preview = document.getElementById("signupProfilePreview");
  const btn = document.getElementById("btnSignup");
  const passBtn = document.getElementById("btnPhoneVerify");

  if (emailInput && !emailInput.dataset.bound) {
    const checkEmail = async () => {
      const email = emailInput.value.trim();
      if (!email) return;

      const emailPattern =
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

      if (!emailPattern.test(email)) {
        msgEmail.textContent = "이메일 형식이 올바르지 않습니다.";
        msgEmail.className = "text-xs text-red-500";
        return;
      }

      const res = await httpClient.post("/users/check", {
        type: "email",
        value: email,
      });

      const { data } = res;

      if (!data.available) {
        msgEmail.textContent = "이미 사용 중인 이메일입니다.";
        msgEmail.className = "text-xs text-red-500";
      } else {
        msgEmail.textContent = "사용 가능한 이메일입니다.";
        msgEmail.className = "text-xs text-green-600";
      }
    };

    emailInput.addEventListener("blur", checkEmail);
    emailInput.dataset.bound = "true";
  }

  if (nicknameInput && !nicknameInput.dataset.bound) {
    const checkNickname = async () => {
      const nickname = nicknameInput.value.trim();
      if (!nickname) return;

      const nicknamePattern = /^[A-Za-z0-9가-힣]{2,10}$/;

      if (!nicknamePattern.test(nickname)) {
        msgNickname.textContent = "닉네임은 2~10자 한글/영문/숫자만 가능합니다.";
        msgNickname.className = "text-xs text-red-500";
        return;
      }

      const res = await httpClient.post("/users/check", {
        type: "nickname",
        value: nickname,
      });

      const { data } = res;

      if (!data.available) {
        msgNickname.textContent = "이미 사용 중인 닉네임입니다.";
        msgNickname.className = "text-xs text-red-500";
      } else {
        msgNickname.textContent = "사용 가능한 닉네임입니다.";
        msgNickname.className = "text-xs text-green-600";
      }
    };

    nicknameInput.addEventListener("blur", checkNickname);
    nicknameInput.dataset.bound = "true";
  }

  const checkPhoneDuplicated = async () => {
    const phone = phoneInput.value.trim();
    if (!phone) return;

    const res = await httpClient.post("/users/check", {
      type: "phone",
      value: phone,
    });

    const { data } = res;

    if (!data.available) {
      msgPhone.textContent = "이미 가입된 휴대폰번호입니다.";
      msgPhone.className = "text-xs text-red-500";
      return false;
    } else {
      msgPhone.textContent = "사용 가능한 휴대폰번호입니다.";
      msgPhone.className = "text-xs text-green-600";
      return true;
    }
  };

  if (passBtn && !passBtn.dataset.boundPass) {
    passBtn.addEventListener("click", async () => {
      try {
        const res = await httpClient.get("/users/pass/start");
        const { data } = res;
        const { impCode, merchantUid } = data;

        if (!window.IMP) {
          alert("본인인증 모듈이 로드되지 않았습니다.");
          return;
        }

        window.IMP.init(impCode);
        window.IMP.certification(
          {
            merchant_uid: merchantUid,
            popup: true,
            pg: "inicis_unified",
          },
          async function (rsp) {
            if (!rsp.success) {
              alert("본인인증 실패");
              return;
            }

            const verify = await httpClient.post("/users/pass/verify", {
              imp_uid: rsp.imp_uid,
            });

            const { data } = verify;

            phoneInput.value = data.phone;
            phoneInput.readOnly = true;

            sessionStorage.setItem("PASS_CI", data.ci);
            sessionStorage.setItem("PASS_DI", data.di);

            await checkPhoneDuplicated();

            alert("본인인증 성공!");
          }
        );
      } catch (err) {
        alert("본인인증 요청 오류 발생");
      }
    });

    passBtn.dataset.boundPass = "true";
  }

  if (passwordInput && !passwordInput.dataset.bound) {
    const checkPassword = () => {
      const pwd = passwordInput.value;

      const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/;

      if (!reg.test(pwd)) {
        msgPassword.textContent = "영문+숫자 포함, 8~20자 형식이 아닙니다.";
        msgPassword.className = "text-xs text-red-500";
      } else {
        msgPassword.textContent = "사용 가능한 비밀번호입니다.";
        msgPassword.className = "text-xs text-green-600";
      }
    };

    passwordInput.addEventListener("input", checkPassword);
    passwordInput.dataset.bound = "true";
  }

  if (passwordCheckInput && !passwordCheckInput.dataset.bound) {
    const checkPasswordConfirm = () => {
      if (passwordInput.value === passwordCheckInput.value) {
        msgPasswordCheck.textContent = "비밀번호가 일치합니다.";
        msgPasswordCheck.className = "text-xs text-green-600";
      } else {
        msgPasswordCheck.textContent = "비밀번호가 일치하지 않습니다.";
        msgPasswordCheck.className = "text-xs text-red-500";
      }
    };

    passwordCheckInput.addEventListener("input", checkPasswordConfirm);
    passwordCheckInput.dataset.bound = "true";
  }

  if (fileInput && preview && !fileInput.dataset.boundPreview) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      preview.src = url;
      preview.classList.remove("hidden");
    });
    fileInput.dataset.boundPreview = "true";
  }

  const requiredFields = [
    { el: emailInput, msg: "이메일을 입력하세요." },
    { el: passwordInput, msg: "비밀번호를 입력하세요." },
    { el: passwordCheckInput, msg: "비밀번호 확인을 입력하세요." },
    { el: nicknameInput, msg: "닉네임을 입력하세요." },
    { el: phoneInput, msg: "휴대폰 번호를 입력하세요." },
  ];

  if (btn && !btn.dataset.boundSignup) {
    btn.addEventListener("click", async () => {
      for (const f of requiredFields) {
        if (!f.el.value.trim()) {
          alert(f.msg);
          f.el.focus();
          return;
        }
      }

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const passwordCheck = passwordCheckInput.value;
      const nickname = nicknameInput.value.trim();
      const phone = phoneInput.value.trim();
      const agreeMarketing =
        document.getElementById("agreeMarketing")?.checked ?? false;

      if (password !== passwordCheck) {
        alert("비밀번호가 일치하지 않습니다.");
        passwordCheckInput.focus();
        return;
      }

      const ci = sessionStorage.getItem("PASS_CI");
      const di = sessionStorage.getItem("PASS_DI");

      if (!ci || !di) {
        alert("본인인증이 필요합니다.");
        return;
      }

      let profileImageBase64 = null;
      if (fileInput && fileInput.files[0]) {
        profileImageBase64 = await toBase64(fileInput.files[0]);
      }

      const payload = {
        email,
        password,
        passwordConfirm: passwordCheck,
        nickname,
        phone,
        ci,
        di,
        agreeMarketing,
        profileImageBase64,
      };

      try {
        // 컨트롤러가 POST /api/users 라면 "/users" 사용
        const res = await httpClient.post("/users", payload);

        if (res.success) {
          alert("회원가입 완료! 이메일 인증을 확인해주세요.");
          window.location.href = "/login";
        } else {
          alert(res.error?.message || "회원가입 실패");
        }
      } catch (err) {
        alert(
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "회원가입 중 오류가 발생했습니다."
        );
      }
    });

    btn.dataset.boundSignup = "true";
  }
}
