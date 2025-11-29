import httpClient from "@/api/httpClient";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 10);
}

export async function initMyPage() {
  const emailEl = document.getElementById("myEmail");
  if (!emailEl) return;

  try {
    const res = await httpClient.get("/users/me");
    const { success, data, error } = res;

    if (!success || !data) {
      const msg = error?.message || "로그인이 필요합니다.";
      alert(msg);
      window.location.href = "/login";
      return;
    }

    const user = data;

    emailEl.textContent = user.email || "";

    const nicknameEl = document.getElementById("myNickname");
    if (nicknameEl) nicknameEl.textContent = user.nickname || "";

    const joinDateEl = document.getElementById("myJoinDate");
    if (joinDateEl) {
      const rawDate = user.regDate || user.reg_date;
      joinDateEl.textContent = formatDate(rawDate);
    }

    const marketingEl = document.getElementById("myMarketing");
    if (marketingEl) {
      const flag =
        user.agreeMarketing ??
        user.marketingAgree ??
        user.marketingOptIn ??
        user.marketing;
      if (flag === null || typeof flag === "undefined") {
        marketingEl.textContent = "정보없음";
      } else {
        marketingEl.textContent = flag ? "수신동의" : "수신거부";
      }
    }

    const phoneEl = document.getElementById("myPhone");
    if (phoneEl) phoneEl.textContent = user.phone || "";

    const profileImageEl = document.getElementById("myProfileImage");
    if (profileImageEl) {
      if (user.profileImage) {
        profileImageEl.src = user.profileImage;
      } else {
        profileImageEl.src =
          "https://static.thenounproject.com/png/363633-200.png";
      }
    }
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    const msg =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      "내 정보 조회 중 오류가 발생했습니다.";
    alert(msg);
    window.location.href = "/login";
    return;
  }

  const btnSubscription = document.getElementById("btnSubscription");
  if (btnSubscription) {
    btnSubscription.onclick = () => {
      window.location.href = "/subscription/list";
    };
  }

  const btnChangePwd = document.getElementById("btnChangePwd");
  if (btnChangePwd) {
    btnChangePwd.onclick = () => {
      window.location.href = "/reset-password";
    };
  }

  const btnPaymentMethod = document.getElementById("btnPaymentMethod");
  if (btnPaymentMethod) {
    btnPaymentMethod.onclick = () => {
      window.location.href = "/payment/method/list";
    };
  }

  const btnUpdateUser = document.getElementById("btnUpdateUser");
  if (btnUpdateUser) {
    btnUpdateUser.onclick = () => {
      window.location.href = "/mypage/edit";
    };
  }

  const googleConnect = document.getElementById("btnGoogleConnect");
  if (googleConnect) {
    googleConnect.onclick = () => {
      window.location.href = "/api/auth/oauth/google";
    };
  }

  const kakaoConnect = document.getElementById("btnKakaoConnect");
  if (kakaoConnect) {
    kakaoConnect.onclick = () => {
      window.location.href = "/api/auth/oauth/kakao";
    };
  }
}
