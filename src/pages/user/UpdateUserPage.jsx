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
import { KeyRound, ShieldCheck, Mail, User, Phone, Upload, BellRing } from "lucide-react";

// 욕설 리스트 (회원가입과 동일)
const BAD_WORDS = ["fuck", "shit", "bitch", "개새", "씨발", "병신", "지랄", "좆", "썅"];

export default function UpdateUserPage() {
  const fileRef = useRef();
  
  // 초기 닉네임 저장 (변경 여부 확인용)
  const [initialNickname, setInitialNickname] = useState("");
  // 닉네임 검증 메시지 상태
  const [nickMsg, setNickMsg] = useState({ text: "", isError: false });

  const { email, nickname, phone, previewImage, agreeMarketing, setField, setUserData } = useUpdateUserStore();

  useEffect(() => {
    const fetch = async () => {
        await loadUserInfo();
        // 초기 로딩 시 현재 닉네임 저장
        const current = useUpdateUserStore.getState().nickname;
        setInitialNickname(current);
    };
    fetch();
  }, []);

  // 🔎 [핵심] 닉네임 검증 함수 (onBlur 및 onSave에서 사용)
  const validateNickname = async (currentNickname) => {
    const v = currentNickname.trim();
    
    // 1. 빈 값 체크
    if (!v) {
      setNickMsg({ text: "닉네임을 입력해주세요.", isError: true });
      return false;
    }

    // 2. 형식 체크 (한글/영문/숫자 2~10자)
    const reg = /^[A-Za-z0-9가-힣]{2,10}$/;
    if (!reg.test(v)) {
      setNickMsg({ text: "닉네임은 2~10자, 한글/영문/숫자만 가능합니다.", isError: true });
      return false;
    }

    // 3. 욕설 필터링
    const lower = v.toLowerCase();
    for (const bad of BAD_WORDS) {
      if (lower.includes(bad)) {
        setNickMsg({ text: "부적절한 단어가 포함되어 있습니다.", isError: true });
        return false;
      }
    }

    // 4. DB 중복 확인 (닉네임이 변경된 경우에만)
    if (v !== initialNickname) {
      const isAvailable = await checkNicknameDuplicate(v);
      if (!isAvailable) {
        setNickMsg({ text: "이미 사용 중인 닉네임입니다.", isError: true });
        return false;
      }
    }

    // 통과
    setNickMsg({ text: "사용 가능한 닉네임입니다.", isError: false });
    return true;
  };

  // 닉네임 입력칸에서 포커스 나갈 때 검증 실행
  const handleNicknameBlur = () => {
    validateNickname(nickname);
  };

  const onSave = async () => {
    try {
      // 저장 전 최종 검증
      const isValid = await validateNickname(nickname);
      if (!isValid) {
        // 검증 실패 시 메시지는 validateNickname 내부에서 설정됨
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
    <div className="min-h-screen bg-[#030014] text-slate-200 font-sans selection:bg-[#FF00CC] selection:text-white flex items-center justify-center py-20 relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FF00CC]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00CCFF]/10 rounded-full blur-[100px] -z-10"></div>

      <Card className="w-full max-w-xl bg-[#0F172A]/60 border-white/10 backdrop-blur-xl shadow-2xl relative z-10">
        
        <CardHeader className="text-center pb-2 border-b border-white/5">
          <CardTitle className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <KeyRound className="w-6 h-6 text-[#FF00CC]" />
            회원정보 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00CC] to-[#00CCFF]">수정</span>
          </CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            닉네임, 휴대폰 번호, 프로필 이미지 및 마케팅 수신 동의를 수정할 수 있습니다.
          </p>
        </CardHeader>

        <CardContent className="space-y-8 p-8">
          
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              <Avatar className="w-28 h-28 border-2 border-white/10 shadow-[0_0_20px_rgba(0,204,255,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#00CCFF]">
                <AvatarImage src={displayImage} className="object-cover" />
                <AvatarFallback className="bg-slate-800 text-slate-500">
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
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

          <div className="space-y-6">
            
            {/* 이메일 */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> 이메일 (ID)
              </Label>
              <Input 
                readOnly 
                value={email || ""} 
                className="bg-slate-900/50 border-white/10 text-slate-400 focus-visible:ring-0 cursor-not-allowed" 
              />
            </div>

            {/* 닉네임 입력 및 검증 */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[#00CCFF] uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> 닉네임
              </Label>
              <Input
                value={nickname || ""}
                onChange={(e) => {
                    setField("nickname", e.target.value);
                    setNickMsg({ text: "", isError: false }); // 입력 중에는 메시지 초기화
                }}
                onBlur={handleNicknameBlur} // 🔥 포커스 나갈 때 검증 실행
                className="bg-[#0F172A] border-white/10 text-white focus-visible:ring-[#00CCFF]/50 focus-visible:border-[#00CCFF] transition-all"
                placeholder="변경할 닉네임 입력"
              />
              {/* 검증 결과 메시지 출력 */}
              {nickMsg.text && (
                <p className={`text-xs ${nickMsg.isError ? "text-red-500" : "text-green-500"}`}>
                  {nickMsg.text}
                </p>
              )}
            </div>

            {/* 휴대폰 번호 */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[#FF00CC] uppercase flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> 휴대폰 번호
              </Label>
              <div className="flex gap-2">
                <Input
                  value={phone || ""}
                  readOnly
                  className="flex-1 bg-[#0F172A] border-white/10 text-slate-300 focus-visible:ring-0"
                />
                <Button 
                  onClick={onPassVerify}
                  className="bg-[#FF00CC]/10 text-[#FF00CC] border border-[#FF00CC]/50 hover:bg-[#FF00CC]/20"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  본인인증
                </Button>
              </div>
            </div>

            {/* 마케팅 동의 */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-white flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-[#00CCFF]" /> 마케팅 정보 수신 동의
                </Label>
                <p className="text-xs text-slate-400">
                  이벤트 및 혜택 정보를 받으시겠습니까?
                </p>
              </div>
              <Switch
                checked={agreeMarketing}
                onCheckedChange={(checked) => setField("agreeMarketing", checked)}
                className="data-[state=checked]:bg-[#00CCFF]"
              />
            </div>

          </div>

          <Button 
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-[#FF00CC] to-[#00CCFF] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(255,0,204,0.4)]"
            onClick={onSave}
          >
            저장하기
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}