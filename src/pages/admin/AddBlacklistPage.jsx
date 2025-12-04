// src/pages/admin/AddBlacklistPage.jsx

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useBlacklistStore } from "@/store/admin/blacklistStore";
import { useAddBlacklistLogic } from "@/services/logic/admin/addBlacklistLogic";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddBlacklistPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const defaultUser = searchParams.get("user") || "";

  const {
    userId,
    reasonType,
    reasonDetail,
    setUserId,
    setReasonType,
    setReasonDetail,
  } = useBlacklistStore();

  const { submit } = useAddBlacklistLogic();

  useEffect(() => {
    if (defaultUser) {
      setUserId(defaultUser);
    }
  }, [defaultUser, setUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await submit();
    if (ok) {
      alert("블랙리스트가 등록되었습니다.");
      navigate("/admin/blacklist");
    }
  };

  const isDirect = reasonType === "DIRECT";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">블랙리스트 등록</h1>

      <Card>
        <CardHeader>
          <CardTitle>새 블랙리스트 등록</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">사용자 이메일</label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>

            {/* 사유 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">등록 사유</label>

              <div className="space-y-2 pl-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reasonType"
                    value="FRAUD"
                    checked={reasonType === "FRAUD"}
                    onChange={(e) => setReasonType(e.target.value)}
                  />
                  부정 이용
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reasonType"
                    value="PAYMENT_ABUSE"
                    checked={reasonType === "PAYMENT_ABUSE"}
                    onChange={(e) => setReasonType(e.target.value)}
                  />
                  결제 악용
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reasonType"
                    value="RUDE_BEHAVIOR"
                    checked={reasonType === "RUDE_BEHAVIOR"}
                    onChange={(e) => setReasonType(e.target.value)}
                  />
                  커뮤니티 비매너
                </label>

                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="radio"
                    name="reasonType"
                    value="DIRECT"
                    checked={reasonType === "DIRECT"}
                    onChange={(e) => setReasonType(e.target.value)}
                  />
                  직접입력
                </label>
              </div>

              {/* 직접입력 Textarea */}
              {isDirect && (
                <Textarea
                  className="h-28 mt-2"
                  value={reasonDetail}
                  onChange={(e) => setReasonDetail(e.target.value)}
                  placeholder="상세 사유를 입력하세요"
                  required
                />
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                취소
              </Button>
              <Button type="submit">등록</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
