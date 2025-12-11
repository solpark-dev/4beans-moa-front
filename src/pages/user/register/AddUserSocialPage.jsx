import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import httpClient from "@/api/httpClient";
import { signup } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { fetchCurrentUser } from "@/api/authApi";
import { useSignupStore } from "@/store/user/addUserStore";

export default function AddUserSocialPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { form, errors, setField, setErrorMessage } = useSignupStore();

  const provider = searchParams.get("provider");
  const providerUserId = searchParams.get("providerUserId");
  const socialEmail = searchParams.get("email");
  const socialNickname = searchParams.get("nickname");
  const socialProfileImage = searchParams.get("profileImageUrl");

  useEffect(() => {
    if (socialEmail) setField("email", socialEmail);
    if (socialNickname) setField("nickname", socialNickname);
    if (socialProfileImage) setField("previewUrl", socialProfileImage);
  }, []);

  const handlePassAuth = async () => {
    try {
      const startRes = await httpClient.get("/users/pass/start");
      const { impCode, merchantUid } = startRes.data;

      window.IMP.init(impCode);
      window.IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
        if (!rsp.success) return;

        const verifyRes = await httpClient.post("/users/pass/verify", {
          imp_uid: rsp.imp_uid,
        });

        const { phone, ci } = verifyRes.data;
        setField("phone", phone);
        sessionStorage.setItem("PASS_CI", ci);
        setErrorMessage("phone", "본인인증 완료", false);
      });
    } catch (e) {
      console.error(e);
      alert("본인인증 실패");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phone = form.phone;
    if (!phone) {
      alert("본인인증을 먼저 진행해주세요.");
      return;
    }

    const dup = await httpClient.get("/users/exists-by-phone", {
      params: { phone },
    });

    // ① 기존 계정 존재 → "연동 + 로그인"
    if (dup.data.exists) {
      const ok = window.confirm(
        `이미 가입된 계정(${dup.data.userId})이 있습니다.\n이 계정과 소셜 계정을 연동 후 로그인할까요?`
      );
      if (ok) {
        const linkRes = await httpClient.post("/oauth/connect-by-phone", {
          provider,
          providerUserId,
          phone,
        });

        if (!linkRes.success) {
          alert(linkRes.error?.message || "연동 실패");
          return;
        }

        const { setTokens, setUser } = useAuthStore.getState();
        setTokens({
          accessToken: linkRes.data.accessToken,
          refreshToken: linkRes.data.refreshToken,
          accessTokenExpiresIn: linkRes.data.accessTokenExpiresIn,
        });

        const meRes = await fetchCurrentUser();
        if (meRes.success) setUser(meRes.data);

        alert("기존 계정과 연동 후 로그인되었습니다.");
        navigate("/", { replace: true });
        return;
      }
    }

    // ② 신규 가입
    const ci = sessionStorage.getItem("PASS_CI");
    const payload = {
      userId: providerUserId,
      password: null,
      passwordConfirm: null,
      nickname: form.nickname,
      phone,
      agreeMarketing: form.agreeMarketing,
      profileImageBase64: null,
      ci,
      provider,
      providerUserId,
    };

    try {
      await signup(payload);
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "가입 실패");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">{provider} 간편가입</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.nickname}
          onChange={(e) => setField("nickname", e.target.value)}
          placeholder="닉네임"
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-2">
          <input
            value={form.phone}
            readOnly
            placeholder="본인인증 필요"
            className="flex-1 border p-2 rounded bg-gray-100"
          />
          <button
            type="button"
            onClick={handlePassAuth}
            className="px-3 py-2 bg-indigo-600 text-white rounded"
          >
            본인인증
          </button>
        </div>

        <button className="w-full py-2 bg-indigo-600 text-white rounded">
          간편가입 완료
        </button>
      </form>
    </div>
  );
}
