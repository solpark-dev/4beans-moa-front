import { useEffect, useRef, useState } from "react";
import {
  loadUserInfo,
  handleImageChange,
  doPassVerification,
  saveUserInfo,
  checkNicknameDuplicate,
} from "@/services/logic/updateUserLogic";

import { useUpdateUserStore } from "@/store/user/updateUserStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { KeyRound, Mail, User, Phone, Upload, BellRing } from "lucide-react";

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

export default function UpdateUserPage() {
  const fileRef = useRef();

  const [initialNickname, setInitialNickname] = useState("");
  const [nickMsg, setNickMsg] = useState({ text: "", isError: false });

  const { email, nickname, phone, previewImage, agreeMarketing, setField } =
    useUpdateUserStore();

  useEffect(() => {
    const fetch = async () => {
      await loadUserInfo();
      const current = useUpdateUserStore.getState().nickname;
      setInitialNickname(current);
    };
    fetch();
  }, []);

  const validateNickname = async (currentNickname) => {
    const v = currentNickname.trim();

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
      const isAvailable = await checkNicknameDuplicate(v);
      if (!isAvailable) {
        setNickMsg({ text: "이미 사용 중인 닉네임입니다.", isError: true });
        return false;
      }
    }

    setNickMsg({ text: "사용 가능한 닉네임입니다.", isError: false });
    return true;
  };

  const handleNicknameBlur = () => {
    validateNickname(nickname);
  };

  const onSave = async () => {
    try {
      const isValid = await validateNickname(nickname);
      if (!isValid) {
        return;
      }

      const file = fileRef.current?.files?.[0] || null;

      await saveUserInfo({
        nickname,
        phone,
        agreeMarketing,
        file,
      });

      alert("회원정보가 수정되었습니다.");
      window.location.href = "/mypage";
    } catch (err) {
      alert(err.message);
    }
  };

  const onPassVerify = async () => {
    try {
      const data = await doPassVerification();
      setField("phone", data.phone);
      alert("본인인증 성공. 휴대폰 번호 변경됨.");
    } catch (err) {
      alert(err.message);
    }
  };

  const onImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const displayImage = previewImage
    ? previewImage.startsWith("blob:") || previewImage.startsWith("http")
      ? previewImage
      : `https://localhost:8443${previewImage}`
    : "https://static.thenounproject.com/png/363633-200.png";

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900">
      {/* 상단 HERO 영역 */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
              MoA 계정 · 회원정보 수정
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3 drop-shadow-md">
              <span className="flex items-center justify-center lg:justify-start gap-2">
                <KeyRound className="w-7 h-7 text-indigo-100" />
                <span>프로필과 연락처를</span>
              </span>
              <span className="block mt-1 text-indigo-100">
                항상 최신 상태로 유지하세요
              </span>
            </h2>
            <p className="text-sm sm:text-base text-indigo-50/90 leading-relaxed max-w-md mx-auto lg:mx-0">
              닉네임, 휴대폰 번호, 프로필 이미지를 한 번에 관리하고 마케팅 정보
              수신 여부도 편하게 설정할 수 있어요.
            </p>
          </div>

          {/* 오른쪽 카드 */}
          <div className="flex-1 w-full max-w-md">
            <Card className="w-full bg-white border border-slate-200 shadow-2xl rounded-3xl">
              <CardHeader className="text-center pb-2 border-b border-slate-200 pt-6 px-6">
                <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                  회원정보 수정
                </CardTitle>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                  닉네임, 휴대폰 번호, 프로필 이미지 및 마케팅 수신 동의를
                  수정할 수 있습니다.
                </p>
              </CardHeader>

              <CardContent className="space-y-7 p-6">
                {/* 프로필 이미지 */}
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Avatar className="w-24 h-24 border border-slate-200 bg-slate-100 transition-all duration-200 group-hover:scale-105">
                      <AvatarImage
                        src={displayImage}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-slate-200 text-slate-600">
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
                    onClick={() => fileRef.current?.click()}
                  >
                    이미지 변경
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={onImageSelect}
                    className="hidden"
                  />
                </div>

                {/* 이메일 */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> 이메일 (ID)
                  </Label>
                  <Input
                    readOnly
                    value={email || ""}
                    className="bg-slate-100 border border-slate-300 text-slate-600 focus-visible:ring-0 cursor-not-allowed text-sm"
                  />
                </div>

                {/* 닉네임 */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> 닉네임
                  </Label>
                  <Input
                    value={nickname || ""}
                    onChange={(e) => {
                      setField("nickname", e.target.value);
                      setNickMsg({ text: "", isError: false });
                    }}
                    onBlur={handleNicknameBlur}
                    className="bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all text-sm"
                    placeholder="변경할 닉네임 입력"
                  />
                  {nickMsg.text && (
                    <p
                      className={`text-xs ${
                        nickMsg.isError ? "text-red-500" : "text-emerald-600"
                      }`}
                    >
                      {nickMsg.text}
                    </p>
                  )}
                </div>

                {/* 휴대폰 번호 + PASS */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> 휴대폰 번호
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={phone || ""}
                      readOnly
                      className="flex-1 bg-slate-100 border border-slate-300 text-slate-700 focus-visible:ring-0 text-sm"
                    />
                    <Button
                      onClick={onPassVerify}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4"
                    >
                      본인인증
                    </Button>
                  </div>
                </div>

                {/* 마케팅 수신 동의 */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-indigo-600" /> 마케팅
                      정보 수신 동의
                    </Label>
                    <p className="text-xs text-slate-500">
                      이벤트 및 혜택 정보를 이메일·문자로 받아보시겠습니까?
                    </p>
                  </div>
                  <Switch
                    checked={agreeMarketing}
                    onCheckedChange={(checked) =>
                      setField("agreeMarketing", checked)
                    }
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>

                <Button
                  className="w-full h-11 text-sm md:text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-xl"
                  onClick={onSave}
                >
                  저장하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
