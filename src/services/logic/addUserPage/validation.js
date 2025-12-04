export function bindValidationEvents() {
  const password = document.getElementById("signupPassword");
  const passwordCheck = document.getElementById("signupPasswordCheck");

  const msgPassword = document.getElementById("msgPassword");
  const msgPasswordCheck = document.getElementById("msgPasswordCheck");

  if (password && !password.dataset.bound) {
    password.addEventListener("input", () => {
      const v = password.value;
      const reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/;

      if (!reg.test(v)) {
        msgPassword.textContent = "영문+숫자+특수문자 포함 8~20자로 입력하세요.";
        msgPassword.className = "text-xs text-red-500";
      } else {
        msgPassword.textContent = "사용 가능한 비밀번호입니다.";
        msgPassword.className = "text-xs text-green-600";
      }
    });
    password.dataset.bound = "true";
  }

  if (passwordCheck && !passwordCheck.dataset.bound) {
    passwordCheck.addEventListener("input", () => {
      const pwVal = password ? password.value : "";

      if (pwVal === passwordCheck.value) {
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