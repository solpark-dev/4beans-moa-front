/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUpdatePwdLogic } from "./useUpdatePassword";
import { useUpdatePwdStore } from "@/store/user/updatePwdStore";
import httpClient from "@/api/httpClient";

vi.mock("@/api/httpClient", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("useUpdatePwdLogic", () => {
  beforeEach(() => {
    useUpdatePwdStore.getState().resetAll();
    vi.clearAllMocks();
    window.alert = vi.fn();
    window.history.back = vi.fn();
  });

  it("reopens the modal cleanly after a reset", () => {
    const store = useUpdatePwdStore.getState();

    store.resetAll();
    expect(store.modalOpen).toBe(false);

    store.openModal();
    expect(useUpdatePwdStore.getState().modalOpen).toBe(true);

    store.resetAll();
    expect(useUpdatePwdStore.getState().modalOpen).toBe(false);

    store.openModal();
    const next = useUpdatePwdStore.getState();

    expect(next.modalOpen).toBe(true);
    expect(next.stepVerified).toBe(false);
    expect(next.currentPassword).toBe("");
    expect(next.newPassword).toBe("");
    expect(next.newPasswordConfirm).toBe("");
  });

  it("shows an error when current password is missing", async () => {
    const { result } = renderHook(() => useUpdatePwdLogic());

    await act(async () => {
      const ok = await result.current.update();
      expect(ok).toBe(false);
    });

    expect(useUpdatePwdStore.getState().error.current).toContain(
      "현재 비밀번호"
    );
  });

  it("surfaces backend errors and keeps state intact on failure", async () => {
    useUpdatePwdStore.setState({
      currentPassword: "oldPass!2",
      newPassword: "NewPass!2",
      newPasswordConfirm: "NewPass!2",
      stepVerified: true,
      modalOpen: false,
      error: { current: "", rule: "", confirm: "" },
    });

    httpClient.post.mockResolvedValue({
      success: false,
      error: { message: "현재 비밀번호가 올바르지 않습니다." },
    });

    const { result } = renderHook(() => useUpdatePwdLogic());

    await act(async () => {
      const ok = await result.current.update();
      expect(ok).toBe(false);
    });

    expect(window.alert).toHaveBeenCalledWith(
      "현재 비밀번호가 올바르지 않습니다."
    );
    expect(useUpdatePwdStore.getState().error.current).toBe(
      "현재 비밀번호가 올바르지 않습니다."
    );
    expect(useUpdatePwdStore.getState().stepVerified).toBe(true);
  });
});
