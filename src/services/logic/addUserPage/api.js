import httpClient from "@/api/httpClient";

const BAD_WORDS = [
  "fuck", "shit", "bitch", "asshole", "개새", "개새끼", "씨발", "시발",
  "좆", "병신", "썅", "새끼", "니미", "염병", "지랄", "닥쳐",
];

export function bindApiEvents() {
  const email = document.getElementById("signupEmail");
  const nickname = document.getElementById("signupNickname");
  const phone = document.getElementById("signupPhone");

  const msgEmail = document.getElementById("msgEmail");
  const msgNickname = document.getElementById("msgNickname");
  const msgPhone = document.getElementById("msgPhone");

  if (email && !email.dataset.boundApi) {
    email.addEventListener("blur", async () => {
      const v = email.value.trim();
      if (!v) return;

      const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!reg.test(v)) {
        msgEmail.textContent = "이메일 형식이 올바르지 않습니다.";
        msgEmail.className = "text-xs text-red-500";
        return;
      }

      try {
        const res = await httpClient.post("/users/check", { type: "email", value: v });
        if (!res.data.available) {
          msgEmail.textContent = "이미 사용 중입니다.";
          msgEmail.className = "text-xs text-red-500";
        } else {
          msgEmail.textContent = "사용 가능한 이메일입니다.";
          msgEmail.className = "text-xs text-green-600";
        }
      } catch (e) { console.error(e); }
    });
    email.dataset.boundApi = "true";
  }

  if (nickname && !nickname.dataset.boundApi) {
    nickname.addEventListener("blur", async () => {
      const v = nickname.value.trim();
      if (!v) return;

      const reg = /^[A-Za-z0-9가-힣]{2,10}$/;
      if (!reg.test(v)) {
        msgNickname.textContent = "닉네임은 2~10자, 한글/영문/숫자만 가능합니다.";
        msgNickname.className = "text-xs text-red-500";
        return;
      }

      const lower = v.toLowerCase();
      for (const bad of BAD_WORDS) {
        if (lower.includes(bad)) {
          msgNickname.textContent = "부적절한 단어가 포함될 수 없습니다.";
          msgNickname.className = "text-xs text-red-500";
          return;
        }
      }

      try {
        const res = await httpClient.post("/users/check", { type: "nickname", value: v });
        if (!res.data.available) {
          msgNickname.textContent = "이미 사용 중입니다.";
          msgNickname.className = "text-xs text-red-500";
        } else {
          msgNickname.textContent = "사용 가능합니다.";
          msgNickname.className = "text-xs text-green-600";
        }
      } catch (e) { console.error(e); }
    });
    nickname.dataset.boundApi = "true";
  }

  if (phone && !phone.dataset.boundApi) {
    phone.addEventListener("blur", async () => {
      const v = phone.value.trim();
      if (!v) return;

      try {
        const res = await httpClient.post("/users/check", { type: "phone", value: v });
        if (!res.data.available) {
          msgPhone.textContent = "이미 가입된 번호입니다.";
          msgPhone.className = "text-xs text-red-500";
        } else {
          msgPhone.textContent = "사용 가능합니다.";
          msgPhone.className = "text-xs text-green-600";
        }
      } catch (e) { console.error(e); }
    });
    phone.dataset.boundApi = "true";
  }
}

export async function startPassAuth() {
  const res = await httpClient.get("/users/pass/start");
  return res.data;
}

export async function verifyPassAuth(impUid) {
  const res = await httpClient.post("/users/pass/verify", { imp_uid: impUid });
  return res.data;
}

export async function requestSignup(payload) {
  const res = await httpClient.post("/users/add", payload);
  return res;
}