import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserStore } from "@/store/user/updateUserStore";
import { useAuthStore } from "@/store/authStore";
import { checkCommon, startPassAuth, verifyPassAuth } from "@/api/authApi";
import { getUser, updateUser, uploadProfileImage } from "@/api/userApi";

import { loadIamport } from "@/utils/iamport";
import { buildPassRedirectUrl, consumePassImpUid } from "@/utils/passRedirect";

const BAD_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "개새",
  "씨발",
  "병신",
  "지랄",
  "좆",
  "썅",
];

const PURPOSE_UPDATE_PHONE = "update-user-phone";

export default function useUpdateUser() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const blobUrlRef = useRef(null);

  const [initialNickname, setInitialNickname] = useState("");
  const [nickMsg, setNickMsg] = useState({ text: "", isError: false });

  const {
    email,
    nickname,
    phone,
    previewImage,
    agreeMarketing,
    profileImage,
    setField,
    setUserData,
  } = useUpdateUserStore();

  const displayImage = useMemo(() => {
    if (previewImage) {
      if (previewImage.startsWith("blob:") || previewImage.startsWith("http"))
        return previewImage;
      return `${window.location.origin}${previewImage}`;
    }
    return "https://static.thenounproject.com/png/363633-200.png";
  }, [previewImage]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getUser();
        if (res?.success && res?.data) {
          setUserData(res.data);
          setInitialNickname(res.data.nickname || "");
          return;
        }
        alert("로그인이 필요합니다.");
        navigate("/login", { replace: true });
      } catch {
        alert("로그인이 필요합니다.");
        navigate("/login", { replace: true });
      }
    };
    run();
  }, [navigate, setUserData]);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const goMypage = () => {
    navigate("/mypage");
  };

  const openFilePicker = () => {
    fileRef.current?.click();
  };

  const onImageSelect = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    const url = URL.createObjectURL(file);
    blobUrlRef.current = url;
    setField("previewImage", url);
  };

  const onNicknameChange = (value) => {
    setField("nickname", value);
    setNickMsg({ text: "", isError: false });
  };

  const onAgreeMarketingChange = (checked) => {
    setField("agreeMarketing", checked);
  };

  const validateNickname = async (currentNickname) => {
    const v = (currentNickname ?? "").trim();

    if (!v) {
      setNickMsg({ text: "닉네임을 입력해주세요.", isError: true });
      return false;
    }

    const reg = /^[A-Za-z0-9가-힣]{2,10}$/;
    if (!reg.test(v)) {
      setNickMsg({
        text: "닉네임은 2~10자, 한글/영문/숫자만 가능합니다.",
        isError: true,
      });
      return false;
    }

    const lower = v.toLowerCase();
    for (const bad of BAD_WORDS) {
      if (lower.includes(bad)) {
        setNickMsg({
          text: "부적절한 단어가 포함되어 있습니다.",
          isError: true,
        });
        return false;
      }
    }

    if (v !== initialNickname) {
      try {
        const res = await checkCommon({ type: "nickname", value: v });
        const available = !!res?.data?.available;
        if (!available) {
          setNickMsg({ text: "이미 사용 중인 닉네임입니다.", isError: true });
          return false;
        }
      } catch {
        setNickMsg({ text: "이미 사용 중인 닉네임입니다.", isError: true });
        return false;
      }
    }

    setNickMsg({ text: "사용 가능한 닉네임입니다.", isError: false });
    return true;
  };

  const onNicknameBlur = async () => {
    await validateNickname(nickname);
  };

  const processPhoneImpUid = useCallback(
    async (impUid) => {
      const verify = await verifyPassAuth({ imp_uid: impUid });
      if (!verify?.success) {
        throw new Error(verify?.error?.message || "본인인증 실패");
      }
      const verified = verify.data;
      setField("phone", verified.phone);
      alert("본인인증 성공. 휴대폰 번호 변경됨.");
    },
    [setField]
  );

  useEffect(() => {
    const impUid = consumePassImpUid(PURPOSE_UPDATE_PHONE);
    if (!impUid) return;

    processPhoneImpUid(impUid).catch((err) => {
      alert(err?.message || "본인인증 실패");
    });
  }, [processPhoneImpUid]);

  const onPassVerify = async () => {
    try {
      const start = await startPassAuth();
      const { impCode, merchantUid } = start?.data || {};

      const IMP = await loadIamport();
      if (!IMP) throw new Error("본인인증 모듈이 로드되지 않았습니다.");

      IMP.init(impCode);
      IMP.certification(
        {
          merchant_uid: merchantUid,
          pg: "inicis_unified",
          popup: true,
          m_redirect_url: buildPassRedirectUrl({
            purpose: PURPOSE_UPDATE_PHONE,
            returnTo: "/mypage/edit",
          }),
        },
        async (rsp) => {
          if (!rsp?.success) return;
          if (!rsp.imp_uid) return;

          try {
            await processPhoneImpUid(rsp.imp_uid);
          } catch (err) {
            alert(err?.message || "본인인증 실패");
          }
        }
      );
    } catch (err) {
      alert(err?.message || "본인인증 실패");
    }
  };

  const onSave = async (options = {}) => {
    const {
      navigateToMypage = true,
      showAlert = true,
      onSuccess,
      onFail,
    } = options;

    try {
      const ok = await validateNickname(nickname);
      if (!ok) return { success: false };

      const file = fileRef.current?.files?.[0] || null;

      let nextProfileUrl = profileImage || null;

      if (file) {
        const form = new FormData();
        form.append("file", file);

        const up = await uploadProfileImage(form);
        if (!up?.success)
          throw new Error(up?.error?.message || "프로필 업로드 실패");
        nextProfileUrl = up.data;
      }

      const res = await updateUser({
        nickname,
        phone,
        agreeMarketing,
        profileImage: nextProfileUrl,
      });

      if (!res?.success)
        throw new Error(res?.error?.message || "회원정보 수정 실패");

      const updatedUser = res.data;

      useAuthStore.getState().setUser(updatedUser);
      setUserData(updatedUser);

      if (showAlert) alert("회원정보가 수정되었습니다.");

      if (typeof onSuccess === "function") onSuccess(updatedUser);

      if (navigateToMypage) {
        navigate("/mypage", { replace: true });
      }

      return { success: true, data: updatedUser };
    } catch (err) {
      if (showAlert) alert(err?.message || "회원정보 수정 실패");
      if (typeof onFail === "function") onFail(err);
      return { success: false, error: err };
    }
  };

  return {
    fileRef,
    email,
    nickname,
    phone,
    agreeMarketing,
    displayImage,
    nickMsg,
    openFilePicker,
    onImageSelect,
    onNicknameChange,
    onNicknameBlur,
    onAgreeMarketingChange,
    onPassVerify,
    onSave,
    goMypage,
  };
}
