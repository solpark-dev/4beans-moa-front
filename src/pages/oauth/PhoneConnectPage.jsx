import { useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  fetchCurrentUser,
  oauthConnectByPhone,
  startPassAuth,
  verifyPassAuth,
} from "@/api/authApi";

import { loadIamport } from "@/utils/iamport";
import {
  buildPassRedirectUrl,
  consumePassImpUid,
  stashSession,
  readSession,
  removeSession,
} from "@/utils/passRedirect";

const PURPOSE_PHONE_CONNECT = "phone-connect";
const PASS_PC_PROVIDER = "PASS_PC_PROVIDER";
const PASS_PC_PROVIDER_USER_ID = "PASS_PC_PROVIDER_USER_ID";

export default function PhoneConnectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { setTokens, setUser, clearAuth } = useAuthStore();
  const runningRef = useRef(false);

  const providerFromState = location.state?.provider;
  const providerUserIdFromState = location.state?.providerUserId;

  const providerFromQuery = searchParams.get("provider") || "";
  const providerUserIdFromQuery = searchParams.get("providerUserId") || "";

  const provider = useMemo(() => {
    return (
      providerFromState ||
      providerFromQuery ||
      readSession(PASS_PC_PROVIDER) ||
      ""
    );
  }, [providerFromState, providerFromQuery]);

  const providerUserId = useMemo(() => {
    return (
      providerUserIdFromState ||
      providerUserIdFromQuery ||
      readSession(PASS_PC_PROVIDER_USER_ID) ||
      ""
    );
  }, [providerUserIdFromState, providerUserIdFromQuery]);

  useEffect(() => {
    if (!provider || !providerUserId) {
      navigate("/login", { replace: true });
      return;
    }

    stashSession(PASS_PC_PROVIDER, provider);
    stashSession(PASS_PC_PROVIDER_USER_ID, providerUserId);
  }, [provider, providerUserId, navigate]);

  const processConnect = useCallback(
    async (impUid) => {
      try {
        const verify = await verifyPassAuth({ imp_uid: impUid });
        if (!verify?.success) {
          throw new Error(
            verify?.error?.message || "본인 인증에 실패했습니다."
          );
        }

        const { phone, ci } = verify.data || {};
        if (!phone || !ci) {
          throw new Error("본인 인증 정보가 올바르지 않습니다.");
        }

        const ok = window.confirm(
          "기존 계정과 소셜 계정을 연동하고 로그인하시겠습니까?"
        );
        if (!ok) return;

        const connectRes = await oauthConnectByPhone({
          provider,
          providerUserId,
          phone,
          ci,
        });

        if (!connectRes?.success) {
          throw new Error(
            connectRes?.error?.message || "계정 연동에 실패했습니다."
          );
        }

        const { accessToken, refreshToken, accessTokenExpiresIn, expiresIn } =
          connectRes.data || {};

        if (accessToken && refreshToken) {
          setTokens({
            accessToken,
            refreshToken,
            accessTokenExpiresIn: accessTokenExpiresIn ?? expiresIn,
          });

          try {
            const meRes = await fetchCurrentUser();
            if (meRes?.success && meRes.data) {
              setUser(meRes.data);
            }
          } catch {
            clearAuth();
          }
        }

        removeSession(PASS_PC_PROVIDER);
        removeSession(PASS_PC_PROVIDER_USER_ID);

        navigate("/", { replace: true });
      } catch (err) {
        alert(err?.message || "계정 연동에 실패했습니다.");
        navigate("/login", { replace: true });
      }
    },
    [provider, providerUserId, setTokens, setUser, clearAuth, navigate]
  );

  useEffect(() => {
    const impUid = consumePassImpUid(PURPOSE_PHONE_CONNECT);
    if (!impUid) return;
    if (!provider || !providerUserId) return;
    processConnect(impUid);
  }, [provider, providerUserId, processConnect]);

  const handlePassAuth = async () => {
    if (!provider || !providerUserId) {
      navigate("/login", { replace: true });
      return;
    }

    if (runningRef.current) return;
    runningRef.current = true;

    try {
      const start = await startPassAuth();
      if (!start?.success) {
        throw new Error(
          start?.error?.message || "본인 인증 시작에 실패했습니다."
        );
      }

      const { impCode, merchantUid } = start.data || {};

      const IMP = await loadIamport();
      if (!IMP) {
        throw new Error("인증 모듈 로드 실패");
      }

      stashSession(PASS_PC_PROVIDER, provider);
      stashSession(PASS_PC_PROVIDER_USER_ID, providerUserId);

      IMP.init(impCode);

      const returnTo = `/oauth/phone-connect?provider=${encodeURIComponent(
        provider
      )}&providerUserId=${encodeURIComponent(providerUserId)}`;

      IMP.certification(
        {
          merchant_uid: merchantUid,
          pg: "inicis_unified",
          popup: true,
          m_redirect_url: buildPassRedirectUrl({
            purpose: PURPOSE_PHONE_CONNECT,
            returnTo,
          }),
        },
        async (rsp) => {
          runningRef.current = false;
          if (!rsp?.success) return;
          if (!rsp.imp_uid) return;
          processConnect(rsp.imp_uid);
        }
      );
    } catch (err) {
      alert(err?.message || "본인 인증 처리 중 오류가 발생했습니다.");
      navigate("/login", { replace: true });
      runningRef.current = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="rounded-2xl bg-slate-900/80 border border-slate-700 px-8 py-10 text-center space-y-4 shadow-xl">
        <div className="text-lg font-semibold text-slate-50">
          이미 가입된 휴대폰 번호가 존재합니다.
        </div>
        <div className="text-sm text-slate-400">
          본인 인증 후 해당 계정과 소셜 계정을 연동합니다.
        </div>
        <button
          type="button"
          onClick={handlePassAuth}
          className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          PASS 본인인증
        </button>
      </div>
    </div>
  );
}
