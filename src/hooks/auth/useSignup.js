import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useSignupStore } from "@/store/user/addUserStore";
import { signup, checkCommon } from "@/api/authApi";

const BAD_WORDS = [
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

const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  NICKNAME: /^[A-Za-z0-9가-힣]{2,10}$/,
  PASSWORD:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/,
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export const useSignup = () => {
  const navigate = useNavigate();
  const { form, errors, setField, setErrorMessage, reset } = useSignupStore();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const nicknameRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    return () => {
      if (form.previewUrl) URL.revokeObjectURL(form.previewUrl);
      reset();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setField(name, type === "checkbox" ? checked : value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setField("profileImage", file);
      setField("previewUrl", url);
    }
  };

  const handleBlur = () => {};

  /* ==============================
      이메일 중복/형식 체크
     ============================== */
  useEffect(() => {
    const checkEmail = async () => {
      if (!form.email) return setErrorMessage("email", "", false);

      if (!REGEX.EMAIL.test(form.email)) {
        return setErrorMessage(
          "email",
          "이메일 형식이 올바르지 않습니다.",
          true
        );
      }

      setErrorMessage("email", "확인 중...", false);

      try {
        const res = await checkCommon({ type: "email", value: form.email });
        const available = res.data?.available ?? res.data?.data?.available;
        setErrorMessage(
          "email",
          available ? "사용 가능한 이메일입니다." : "이미 사용 중입니다.",
          !available
        );
      } catch {
        setErrorMessage("email", "중복 확인 불가 (서버 오류)", false);
      }
    };

    const t = setTimeout(checkEmail, 400);
    return () => clearTimeout(t);
  }, [form.email]);

  /* ==============================
      비밀번호 규칙 검사
     ============================== */
  useEffect(() => {
    if (!form.password) return setErrorMessage("password", "", false);

    if (!REGEX.PASSWORD.test(form.password)) {
      setErrorMessage(
        "password",
        "영문+숫자+특수문자 포함 8~20자로 입력하세요.",
        true
      );
    } else {
      setErrorMessage("password", "사용 가능한 비밀번호입니다.", false);
    }
  }, [form.password]);

  /* ==============================
      비밀번호 일치 검사
     ============================== */
  useEffect(() => {
    if (!form.passwordCheck) return setErrorMessage("passwordCheck", "", false);

    if (form.password !== form.passwordCheck) {
      setErrorMessage("passwordCheck", "비밀번호가 일치하지 않습니다.", true);
    } else {
      setErrorMessage("passwordCheck", "비밀번호가 일치합니다.", false);
    }
  }, [form.passwordCheck, form.password]);

  /* ==============================
      닉네임 검사 + 금칙어 검사
     ============================== */
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

      if (BAD_WORDS.some((bad) => form.nickname.toLowerCase().includes(bad))) {
        return setErrorMessage(
          "nickname",
          "부적절한 단어가 포함될 수 없습니다.",
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

  /* ==============================
      PASS 본인인증
     ============================== */
  const handlePassAuth = async () => {
    try {
      const start = await httpClient.get("/users/pass/start");
      const { impCode, merchantUid } = start.data;

      if (!window.IMP) return alert("인증 모듈 로드 실패");

      window.IMP.init(impCode);
      window.IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
        if (!rsp.success) return;

        const verify = await httpClient.post("/users/pass/verify", {
          imp_uid: rsp.imp_uid,
        });

        const { phone, ci } = verify.data;

        setField("phone", phone);
        sessionStorage.setItem("PASS_CI", ci);
        setErrorMessage("phone", "본인인증 성공!", false);
      });
    } catch {
      alert("본인인증 오류");
    }
  };

  /* ==============================
      최종 회원가입 제출
     ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || errors.email.isError)
      return alert("이메일을 확인해주세요.");

    if (!form.password || errors.password.isError)
      return alert("비밀번호를 확인해주세요.");

    if (!form.passwordCheck || errors.passwordCheck.isError)
      return alert("비밀번호 일치 여부를 확인해주세요.");

    if (!form.nickname || errors.nickname.isError)
      return alert("닉네임을 확인해주세요.");

    if (!form.phone) return alert("본인인증을 진행해주세요.");

    const ci = sessionStorage.getItem("PASS_CI");
    if (!ci) return alert("본인인증 정보를 찾을 수 없습니다.");

    let base64 = null;
    if (form.profileImage) base64 = await toBase64(form.profileImage);

    const payload = {
      userId: form.email,
      password: form.password,
      passwordConfirm: form.passwordCheck,
      nickname: form.nickname,
      phone: form.phone,
      agreeMarketing: form.agreeMarketing,
      profileImageBase64: base64,
      ci,
    };

    try {
      await signup(payload);
      alert("인증 이메일이 발송되었습니다.\n이메일을 확인해주세요.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "회원가입 실패");
    }
  };

  return {
    form,
    errors,
    refs: { emailRef, passwordRef, passwordCheckRef, nicknameRef, phoneRef },
    handleChange,
    handleBlur,
    handleImageChange,
    handlePassAuth,
    handleSubmit,
  };
};
