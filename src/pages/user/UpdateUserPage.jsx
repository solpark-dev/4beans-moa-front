// src/pages/user/UpdateUserPage.jsx

import { useEffect, useRef } from "react";
import {
  loadUserInfo,
  handleImageChange,
  doPassVerification,
  saveUserInfo,
} from "@/services/logic/updateUserLogic";

import { useUpdateUserStore } from "@/store/user/updateUserStore";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function UpdateUserPage() {
  const fileRef = useRef();

  const { email, nickname, phone, previewImage, setField } =
    useUpdateUserStore();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const onSave = async () => {
    try {
      const file = fileRef.current?.files?.[0] || null;

      await saveUserInfo({
        nickname,
        phone,
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
    if (file) handleImageChange(file);
  };

  return (
    <div className="flex flex-col items-center pt-28 pb-20 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">회원정보 수정</h2>
      <p className="text-gray-500 mb-8 text-sm">
        닉네임, 휴대폰 번호, 프로필 이미지를 수정할 수 있습니다.
      </p>

      <Card className="w-full max-w-xl p-8">
        <CardContent className="space-y-6">
          <div>
            <Label>이메일 (아이디)</Label>
            <Input readOnly value={email} className="bg-gray-100 mt-1" />
          </div>
          <div>
            <Label>닉네임</Label>
            <Input
              value={nickname}
              onChange={(e) => setField("nickname", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>휴대폰 번호</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={phone}
                onChange={(e) => setField("phone", e.target.value)}
                className="flex-1"
              />
              <Button onClick={onPassVerify}>PASS 인증</Button>
            </div>
          </div>
          <div>
            <Label>프로필 이미지</Label>

            <div className="flex items-center gap-4 mt-2">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={
                    previewImage ||
                    "https://static.thenounproject.com/png/363633-200.png"
                  }
                />
              </Avatar>

              <Input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onImageSelect}
                className="max-w-xs"
              />
            </div>
          </div>

          <Button className="w-full mt-4" onClick={onSave}>
            저장하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
