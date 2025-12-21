import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useSignupStore } from "@/store/user/addUserStore";
import { signup, checkCommon } from "@/api/authApi";

import { loadIamport } from "@/utils/iamport";
import { buildPassRedirectUrl, consumePassImpUid } from "@/utils/passRedirect";

const REGEX = {
  NICKNAME: /^[A-Za-z0-9가-힣]{2,10}$/,
};

const PURPOSE_SOCIAL_SIGNUP = "social-signup";

export const useSocialSignup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { form, errors, setField, setErrorMessage, reset } = useSignupStore();

  const nicknameRef = useRef(null);
  const phoneRef = useRef(null);

  const provider = searchParams.get("provider");
  const providerUserId = searchParams.get("providerUserId");
  const email = searchParams.get("email");
  const nickname = searchParams.get("nickname");
  const profileImageUrl = searchParams.get("profileImageUrl");

  useEffect(() => {
    if (email) setField("email", email);
    if (nickname) setField("nickname", nickname);
    if (profileImageUrl) setField("previewUrl", profileImageUrl);

    return () => reset();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  useEffect(() => {
    const checkNickname = async () => {
      if (!form.nickname) return setErrorMessage("nickname", "", false);

      if (!REGEX.NICKNAME.test(form.nickname)) {
        return setErrorMessage(
          "nickname",
          "닉네임은 2~10자, 한글/영문/숫자만 가능합니다.",
          true
        );
      }

      setErrorMessage("nickname", "확인 중...", false);

      try {
        const res = await checkCommon({
          type: "nickname",
          value: form.nickname,
        });
        const available = res.data?.available ?? res.data?.data?.available;
        setErrorMessage(
          "nickname",
          available ? "사용 가능한 닉네임입니다." : "이미 사용 중입니다.",
          !available
        );
      } catch {
        setErrorMessage("nickname", "중복 확인 불가 (서버 오류)", false);
      }
    };

    const t = setTimeout(checkNickname, 400);
    return () => clearTimeout(t);
  }, [form.nickname]);

  const processImpUid = useCallback(
    async (impUid) => {
      const verify = await httpClient.post("/signup/pass/verify", {
        imp_uid: impUid,
      });

      const { phone, ci } = verify.data;

      setField("phone", phone);
      sessionStorage.setItem("PASS_CI", ci);
      setErrorMessage("phone", "본인인증 성공!", false);
    },
    [setField, setErrorMessage]
  );

  useEffect(() => {
    const impUid = consumePassImpUid(PURPOSE_SOCIAL_SIGNUP);
    if (impUid) {
      processImpUid(impUid).catch(() => {
        alert("본인인증 실패");
      });
    }
  }, [processImpUid]);

  const handlePassAuth = async () => {
    try {
      const start = await httpClient.get("/signup/pass/start");
      const { impCode, merchantUid } = start.data;

      const IMP = await loadIamport();
      if (!IMP) {
        alert("본인인증 모듈 로드에 실패했습니다.");
        return;
      }

      IMP.init(impCode);

      const returnTo = `${window.location.pathname}${window.location.search}`;

      IMP.certification(
        {
          merchant_uid: merchantUid,
          pg: "inicis_unified",
          popup: true,
          m_redirect_url: buildPassRedirectUrl({
            purpose: PURPOSE_SOCIAL_SIGNUP,
            returnTo,
          }),
        },
        async (rsp) => {
          if (!rsp?.success) return;
          if (!rsp.imp_uid) return;

          try {
            await processImpUid(rsp.imp_uid);
          } catch {
            alert("본인인증 실패");
          }
        }
      );
    } catch {
      alert("본인인증 실패");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nickname || errors.nickname.isError)
      return alert("닉네임을 확인해주세요.");

    if (!form.phone) return alert("본인인증을 진행해주세요.");

    const ci = sessionStorage.getItem("PASS_CI");
    if (!ci) return alert("본인인증 정보가 없습니다.");

    const payload = {
      userId: providerUserId,
      password: null,
      passwordConfirm: null,
      nickname: form.nickname,
      phone: form.phone,
      agreeMarketing: form.agreeMarketing,
      profileImageBase64: form.previewUrl,
      ci,
      provider,
      providerUserId,
    };

    try {
      await signup(payload);
      alert("소셜 회원가입 완료!\n로그인 해주세요.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "회원가입 실패");
    }
  };

  return {
    form,
    errors,
    provider,
    handleChange,
    handlePassAuth,
    handleSubmit,
    refs: { nicknameRef, phoneRef },
  };
};
