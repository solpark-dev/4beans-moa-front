// src/services/logic/admin/addBlacklistLogic.js

import httpClient from "@/api/httpClient";
import { useBlacklistStore } from "@/store/admin/blacklistStore";

export function useAddBlacklistLogic() {
  const { userId, reasonType, reasonDetail } = useBlacklistStore();

  const submit = async () => {
    if (!userId) {
      alert("이메일을 입력해 주세요.");
      return false;
    }

    let reason = "";

    if (reasonType === "DIRECT") {
      if (!reasonDetail.trim()) {
        alert("직접입력 사유를 입력해 주세요.");
        return false;
      }
      reason = reasonDetail.trim();
    } else {
      reason = reasonType;
    }

    try {
      const res = await httpClient.post("/admin/blacklist/add", {
        userId,
        reason,
      });

      if (res.success) return true;

      alert(res.error?.message || "블랙리스트 등록 실패");
      return false;
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "서버 오류가 발생했습니다.";

      alert(msg);
      return false;
    }
  };

  return { submit };
}
