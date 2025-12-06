// src/hooks/admin/useRemoveBlacklist.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserBlacklist } from "@/api/adminUserApi";
import { useRemoveBlacklistStore } from "@/store/admin/removeBlacklistStore";

export const useRemoveBlacklistLogic = () => {
  const navigate = useNavigate();
  const {
    userId,
    reason,
    submitting,
    error,
    setUserId,
    setReason,
    setSubmitting,
    setError,
    reset,
  } = useRemoveBlacklistStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    if (user) {
      setUserId(user);
    }
  }, [setUserId]);

  const handleChangeReason = (value) => {
    setReason(value);
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("회원 아이디 정보가 없습니다.");
      return;
    }
    if (!reason || !reason.trim()) {
      alert("해제 사유를 입력해 주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await deleteUserBlacklist({
        userId,
        deleteReason: reason.trim(),
      });

      if (!res.success) {
        throw new Error(
          res.error?.message || "블랙리스트 해제에 실패했습니다."
        );
      }

      alert("블랙리스트가 해제되었습니다.");
      reset();
      navigate(`/admin/users/${encodeURIComponent(userId)}`, { replace: true });
    } catch (e) {
      setError(e.message);
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    navigate(-1);
  };

  return {
    userId,
    reason,
    submitting,
    error,
    handleChangeReason,
    handleSubmit,
    handleCancel,
  };
};
