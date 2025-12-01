// src/services/logic/addUserPage/api.js
import httpClient from "@/api/httpClient";

export function bindApiEvents() {
  const email = document.getElementById("signupEmail");
  const nickname = document.getElementById("signupNickname");
  const phone = document.getElementById("signupPhone");
  const msgEmail = document.getElementById("msgEmail");
  const msgNickname = document.getElementById("msgNickname");
  const msgPhone = document.getElementById("msgPhone");

  // 이메일 중복 체크
  if (email && !email.dataset.boundAll) {
    email.addEventListener("blur", async () => {
      const v = email.value.trim();

      if (!v) return;

      // 형식 체크
      const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!reg.test(v)) {
        msgEmail.textContent = "이메일 형식이 올바르지 않습니다.";
        msgEmail.className = "text-xs text-red-500";
        return;
      }

      // 중복 체크
      const res = await httpClient.post("/users/check", {
        type: "email",
        value: v,
      });

      if (!res.data.available) {
        msgEmail.textContent = "이미 사용 중입니다.";
        msgEmail.className = "text-xs text-red-500";
      } else {
        msgEmail.textContent = "사용 가능한 이메일입니다.";
        msgEmail.className = "text-xs text-green-600";
      }
    });

    email.dataset.boundAll = "true";
  }

  // 닉네임 중복 체크
  if (nickname && !nickname.dataset.boundApi) {
    nickname.addEventListener("blur", async () => {
      if (!nickname.value.trim()) return;
      const res = await httpClient.post("/users/check", {
        type: "nickname",
        value: nickname.value.trim(),
      });
      if (!res.data.available) {
        msgNickname.textContent = "이미 사용 중입니다.";
        msgNickname.className = "text-xs text-red-500";
      } else {
        msgNickname.textContent = "사용 가능합니다.";
        msgNickname.className = "text-xs text-green-600";
      }
    });
    nickname.dataset.boundApi = "true";
  }

  // 휴대폰 중복 체크
  if (phone && !phone.dataset.boundApi) {
    phone.addEventListener("blur", async () => {
      if (!phone.value.trim()) return;
      const res = await httpClient.post("/users/check", {
        type: "phone",
        value: phone.value.trim(),
      });
      if (!res.data.available) {
        msgPhone.textContent = "이미 가입된 번호입니다.";
        msgPhone.className = "text-xs text-red-500";
      } else {
        msgPhone.textContent = "사용 가능합니다.";
        msgPhone.className = "text-xs text-green-600";
      }
    });
    phone.dataset.boundApi = "true";
  }
}

// PASS 인증 (제출 로직에서 호출)
export async function startPassAuth() {
  const res = await httpClient.get("/users/pass/start");
  return res.data;
}

export async function verifyPassAuth(impUid) {
  const res = await httpClient.post("/users/pass/verify", { imp_uid: impUid });
  return res.data;
}

// 회원가입 API
export async function requestSignup(payload) {
  const res = await httpClient.post("/users/add", payload);
  return res;
}
