import httpClient from "@/api/httpClient";

export function initDeleteUserPage() {
  const btn = document.getElementById("btnDeleteUser");
  const detail = document.getElementById("deleteDetail");

  if (!btn || !detail) return;

  if (!btn.dataset.boundDelete) {
    btn.addEventListener("click", async () => {
      const selected = document.querySelector("input[name='deleteReason']:checked");
      if (!selected) {
        alert("탈퇴 사유를 선택해 주세요.");
        return;
      }

      const deleteType = selected.value;
      const deleteDetail = detail.value.trim();

      if (deleteType === "OTHER" && !deleteDetail) {
        alert("기타 사유를 입력해 주세요.");
        return;
      }

      if (!window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
        return;
      }

      try {
        const res = await httpClient.delete("/users", {
          data: { deleteType, deleteDetail },
        });

        if (res.success) {
          alert("회원 탈퇴가 완료되었습니다.");
          window.location.href = "/";
        } else {
          const msg = res.error?.message || "탈퇴 처리에 실패했습니다.";
          alert(msg);
        }
      } catch (err) {
        const msg =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "탈퇴 처리 중 오류가 발생했습니다.";
        alert(msg);
      }
    });

    btn.dataset.boundDelete = "true";
  }
}
