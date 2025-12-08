// src/services/logic/deleteUserLogic.js
import httpClient from "@/api/httpClient";

export function initDeleteUserPage() {
  const btn = document.getElementById("btnDeleteUser");
  const detail = document.getElementById("deleteDetail");
  const reasonGroup = document.getElementById("deleteReasonGroup");
  const detailWrapper = document.getElementById("deleteDetailWrapper");

  if (!btn || !detail || !reasonGroup || !detailWrapper) return;

  if (!reasonGroup.dataset.boundReasonChange) {
    reasonGroup.addEventListener("change", (event) => {
      const target = event.target;
      if (!target || target.name !== "deleteReason") return;

      if (target.value === "OTHER") {
        detailWrapper.classList.remove("hidden");
        detail.focus();
      } else {
        detailWrapper.classList.add("hidden");
        detail.value = "";
      }
    });

    reasonGroup.dataset.boundReasonChange = "true";
  }

  if (!btn.dataset.boundDelete) {
    btn.addEventListener("click", async () => {
      const selected = document.querySelector(
        "input[name='deleteReason']:checked"
      );
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

      if (
        !window.confirm(
          "정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        )
      ) {
        return;
      }

      try {
        const res = await httpClient.post("/users/delete", {
          deleteType,
          deleteDetail,
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
