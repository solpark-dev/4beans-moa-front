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

  let user;

  try {
    const res = await httpClient.get("/users/me");
    const { success, data, error } = res;

    if (!success || !data) {
      const msg = error?.message || "로그인이 필요합니다.";
      alert(msg);
      window.location.href = "/login";
      return;
    }

    user = data;

    const loginProviderEl = document.getElementById("myLoginProvider");
    if (loginProviderEl) {
      const activeConn = user.oauthConnections?.find((c) => !c.releaseDate);
      if (activeConn) {
        loginProviderEl.textContent =
          activeConn.provider === "google" ? "Google 로그인" : "Kakao 로그인";
      } else {
        loginProviderEl.textContent = "일반 로그인";
      }
    }

    emailEl.textContent = user.userId || "";

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
        if (user.profileImage.startsWith("/")) {
          profileImageEl.src = `https://localhost:8443${user.profileImage}`;
        } else {
          profileImageEl.src = user.profileImage;
        }
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
      window.location.href = "/mypage/password";
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

  const googleButton = document.getElementById("btnGoogleConnect");
  if (googleButton) {
    const connections = user.oauthConnections || [];
    const googleConn = connections.find(
      (c) => c.provider === "google" && !c.releaseDate
    );

    if (googleConn) {
      googleButton.textContent = "Google 연동 해제";
      googleButton.onclick = async () => {
        if (!window.confirm("Google 계정 연동을 해제하시겠습니까?")) return;
        try {
          const res = await httpClient.post("/oauth/release", {
            oauthId: googleConn.oauthId,
          });
          if (res.success) {
            alert("Google 계정 연동이 해제되었습니다.");
            window.location.reload();
          }
        } catch (e) {
          console.log(e);
          alert("Google 연동 해제 중 오류가 발생했습니다.");
        }
      };
    } else {
      googleButton.textContent = "Google로 시작하기";
      googleButton.onclick = () => {
        window.location.href = "/api/oauth/google/auth";
      };
    }
  }

  const kakaoButton = document.getElementById("btnKakaoConnect");
  if (kakaoButton) {
    const connections = user.oauthConnections || [];
    const kakaoConn = connections.find(
      (c) => c.provider === "kakao" && !c.releaseDate
    );

    if (kakaoConn) {
      kakaoButton.textContent = "카카오 연동 해제";
      kakaoButton.onclick = async () => {
        if (!window.confirm("카카오 계정 연동을 해제하시겠습니까?")) {
          return;
        }
        try {
          const res = await httpClient.post("/oauth/release", {
            oauthId: kakaoConn.oauthId,
          });
          if (res.success) {
            alert("카카오 계정 연동이 해제되었습니다.");
            window.location.reload();
          } else {
            const msg =
              res.error?.message || "카카오 연동 해제 중 오류가 발생했습니다.";
            alert(msg);
          }
        } catch (e) {
          const msg =
            e.response?.data?.error?.message ||
            e.response?.data?.message ||
            "카카오 연동 해제 중 오류가 발생했습니다.";
          alert(msg);
        }
      };
    } else {
      kakaoButton.textContent = "Kakao로 시작하기";
      kakaoButton.onclick = () => {
        window.location.href = "https://localhost:8443/api/oauth/kakao/auth";
      };
    }
  }
}
