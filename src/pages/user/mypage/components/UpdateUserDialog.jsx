import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Upload, BellRing } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { formatPhone } from "@/utils/phoneUtils";
import useUpdateUser from "@/hooks/user/useUpdateUser";

const dialogThemeStyles = {
  pop: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    label: "text-black",
    input: "bg-white border-gray-200 text-black",
    inputReadonly: "bg-slate-100 border-gray-200 text-gray-700",
    switchBg: "data-[state=checked]:bg-pink-500",
    primaryBtn: "bg-pink-500 hover:bg-pink-600 text-white",
    secondaryBtn: "bg-white border-gray-200 text-black hover:bg-slate-50",
    sectionBg: "bg-slate-100 border-gray-200",
    mutedText: "text-gray-600",
  },
  classic: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    label: "text-black",
    input: "bg-white border-gray-200 text-black",
    inputReadonly: "bg-slate-100 border-gray-200 text-gray-700",
    switchBg: "data-[state=checked]:bg-[#635bff]",
    primaryBtn: "bg-[#635bff] hover:bg-[#5851e8] text-white",
    secondaryBtn: "bg-white border-gray-200 text-black hover:bg-slate-50",
    sectionBg: "bg-slate-100 border-gray-200",
    mutedText: "text-gray-600",
  },
  dark: {
    content: "bg-[#1E293B] border border-gray-700",
    title: "text-gray-100",
    label: "text-gray-200",
    input: "bg-[#0F172A] border-gray-700 text-gray-100",
    inputReadonly: "bg-[#0F172A] border-gray-700 text-gray-400",
    switchBg: "data-[state=checked]:bg-[#635bff]",
    primaryBtn: "bg-[#635bff] hover:bg-[#5851e8] text-white",
    secondaryBtn:
      "bg-[#0F172A] border-gray-700 text-gray-200 hover:bg-gray-800",
    sectionBg: "bg-[#0F172A] border-gray-700",
    mutedText: "text-gray-400",
  },
  christmas: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    label: "text-black",
    input: "bg-white border-gray-200 text-black",
    inputReadonly: "bg-slate-100 border-gray-200 text-gray-700",
    switchBg: "data-[state=checked]:bg-[#c41e3a]",
    primaryBtn: "bg-[#c41e3a] hover:bg-red-700 text-white",
    secondaryBtn: "bg-white border-gray-200 text-black hover:bg-red-50",
    sectionBg: "bg-slate-100 border-gray-200",
    mutedText: "text-gray-600",
  },
};

export function UpdateUserDialog({ open, onOpenChange }) {
  const { theme } = useThemeStore();
  const themeStyle = dialogThemeStyles[theme] || dialogThemeStyles.pop;

  const {
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
  } = useUpdateUser();

  const handleSave = async () => {
    const result = await onSave?.();
    const ok =
      result === true ||
      result?.success === true ||
      result?.data?.success === true;

    if (ok) {
      onOpenChange?.(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-md ${themeStyle.content}`}>
        <DialogHeader>
          <DialogTitle
            className={`flex items-center gap-2 ${themeStyle.title}`}
          >
            <User className="w-5 h-5" />
            회원정보 수정
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative group cursor-pointer"
              onClick={openFilePicker}
            >
              <Avatar className="w-20 h-20 border border-gray-200">
                <AvatarImage src={displayImage} className="object-cover" />
                <AvatarFallback className="bg-slate-200 text-slate-700">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-20 h-20 rounded-full bg-black/40 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openFilePicker}
              className={`${themeStyle.secondaryBtn} rounded-xl`}
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

          <Separator
            className={theme === "dark" ? "bg-gray-700" : "bg-gray-200"}
          />

          <div className="space-y-2">
            <Label className={`text-sm font-bold ${themeStyle.label}`}>
              이메일 (ID)
            </Label>
            <Input
              readOnly
              value={email || ""}
              className={`${themeStyle.inputReadonly} rounded-xl cursor-not-allowed`}
            />
          </div>

          <div className="space-y-2">
            <Label className={`text-sm font-bold ${themeStyle.label}`}>
              닉네임
            </Label>
            <Input
              value={nickname || ""}
              onChange={(e) => onNicknameChange?.(e.target.value)}
              onBlur={onNicknameBlur}
              placeholder="변경할 닉네임 입력"
              className={`${themeStyle.input} rounded-xl`}
            />
            {!!nickMsg?.text && (
              <p
                className={`text-xs ${
                  nickMsg.isError ? "text-red-500" : "text-emerald-600"
                }`}
              >
                {nickMsg.text}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className={`text-sm font-bold ${themeStyle.label}`}>
              휴대폰 번호
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={formatPhone(phone) || "-"}
                className={`flex-1 ${themeStyle.inputReadonly} rounded-xl cursor-not-allowed`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={onPassVerify}
                className={`${themeStyle.secondaryBtn} rounded-xl px-4`}
              >
                본인인증
              </Button>
            </div>
          </div>

          <Separator
            className={theme === "dark" ? "bg-gray-700" : "bg-gray-200"}
          />

          <div className={`${themeStyle.sectionBg} border rounded-xl p-4`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4" />
                <div>
                  <p className={`text-sm font-bold ${themeStyle.label}`}>
                    마케팅 정보 수신 동의
                  </p>
                  <p className={`text-xs ${themeStyle.mutedText}`}>
                    이벤트 및 혜택 정보를 받아보세요
                  </p>
                </div>
              </div>
              <Switch
                checked={!!agreeMarketing}
                onCheckedChange={onAgreeMarketingChange}
                className={themeStyle.switchBg}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
              className={`flex-1 ${themeStyle.secondaryBtn} rounded-xl`}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className={`flex-1 ${themeStyle.primaryBtn} rounded-xl`}
            >
              저장하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateUserDialog;
