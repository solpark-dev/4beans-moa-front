// src/services/logic/addUserPage/validation.js

export function bindValidationEvents() {
  const email = document.getElementById("signupEmail");
  const nickname = document.getElementById("signupNickname");
  const password = document.getElementById("signupPassword");
  const passwordCheck = document.getElementById("signupPasswordCheck");

  const msgEmail = document.getElementById("msgEmail");
  const msgNickname = document.getElementById("msgNickname");
  const msgPassword = document.getElementById("msgPassword");
  const msgPasswordCheck = document.getElementById("msgPasswordCheck");

  // 욕설 리스트
  const badWords = [
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "개새",
    "개새끼",
    "씨발",
    "시발",
    "좆",
    "병신",
    "썅",
    "새끼",
    "니미",
    "염병",
    "지랄",
    "닥쳐",
  ];

  // ============================
  // 이메일
  // ============================
  if (email && !email.dataset.bound) {
    email.addEventListener("blur", () => {
      const v = email.value.trim();

      // 특수문자 불가한 완전 안전한 이메일 패턴
      const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!v) return;

      if (!reg.test(v)) {
        msgEmail.textContent = "이메일 형식이 올바르지 않습니다.";
        msgEmail.className = "text-xs text-red-500";
      } else {
        msgEmail.textContent = "사용 가능한 이메일입니다.";
        msgEmail.className = "text-xs text-green-600";
      }
    });

    email.dataset.bound = "true";
  }

  // ============================
  // 닉네임 (욕설 + 특수문자 금지)
  // ============================
  if (nickname && !nickname.dataset.bound) {
    nickname.addEventListener("blur", () => {
      const v = nickname.value.trim();

      // 한글 / 영문 / 숫자 2~10자
      const reg = /^[A-Za-z0-9가-힣]{2,10}$/;

      if (!v) return;

      // 1) 기본 문자 규칙
      if (!reg.test(v)) {
        msgNickname.textContent =
          "닉네임은 2~10자, 한글/영문/숫자만 가능합니다.";
        msgNickname.className = "text-xs text-red-500";
        return;
      }

      // 2) 욕설 필터링
      const lower = v.toLowerCase();
      for (const bad of badWords) {
        if (lower.includes(bad)) {
          msgNickname.textContent = "부적절한 단어가 포함될 수 없습니다.";
          msgNickname.className = "text-xs text-red-500";
          return;
        }
      }

      msgNickname.textContent = "";
      msgNickname.className = "text-xs";
    });

    nickname.dataset.bound = "true";
  }

  // ============================
  // 비밀번호 규칙
  // ============================
  if (password && !password.dataset.bound) {
    password.addEventListener("input", () => {
      const v = password.value;

      // 영문 + 숫자 + 특수문자 포함 8~20자
      const reg =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/;

      if (!reg.test(v)) {
        msgPassword.textContent =
          "영문+숫자+특수문자 포함 8~20자로 입력하세요.";
        msgPassword.className = "text-xs text-red-500";
      } else {
        msgPassword.textContent = "사용 가능한 비밀번호입니다.";
        msgPassword.className = "text-xs text-green-600";
      }
    });

    password.dataset.bound = "true";
  }

  // ============================
  // 비밀번호 확인
  // ============================
  if (passwordCheck && !passwordCheck.dataset.bound) {
    passwordCheck.addEventListener("input", () => {
      if (password.value === passwordCheck.value) {
        msgPasswordCheck.textContent = "비밀번호가 일치합니다.";
        msgPasswordCheck.className = "text-xs text-green-600";
      } else {
        msgPasswordCheck.textContent = "비밀번호가 일치하지 않습니다.";
        msgPasswordCheck.className = "text-xs text-red-500";
      }
    });
    passwordCheck.dataset.bound = "true";
  }
}
