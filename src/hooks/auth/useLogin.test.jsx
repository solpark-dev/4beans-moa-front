/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act, cleanup, render, screen } from "@testing-library/react";
import { useLoginPageLogic, applyRememberEmail, purgeLoginPasswordKeys } from "./useLogin";
import { useLoginStore } from "@/store/user/loginStore";
import httpClient from "@/api/httpClient";
import { login as apiLogin } from "@/api/authApi";
import { LoginForm } from "@/pages/user/login/components/LoginForm";

vi.mock("@/api/authApi", () => ({
  login: vi.fn(),
  startPassAuth: vi.fn(),
  verifyPassAuth: vi.fn(),
}));

vi.mock("@/api/httpClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

describe("useLoginPageLogic security", () => {
  beforeEach(() => {
    useLoginStore.setState({
      email: "",
      password: "",
      remember: false,
      otpRequired: false,
      otpModalOpen: false,
      otpCode: "",
      otpToken: null,
    });
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it("purges any stored password keys", () => {
    const storage = {
      data: new Map(),
      removeItem(key) {
        this.data.delete(key);
      },
      setItem(key, value) {
        this.data.set(key, value);
      },
      getItem(key) {
        return this.data.get(key) ?? null;
      },
    };

    storage.setItem("password", "secret");
    storage.setItem("login-password", "secret2");
    storage.setItem("other", "keep");

    purgeLoginPasswordKeys(storage, storage);

    expect(storage.getItem("password")).toBeNull();
    expect(storage.getItem("login-password")).toBeNull();
    expect(storage.getItem("other")).toBe("keep");
  });

  it("stores only email when rememberId is checked", () => {
    applyRememberEmail(localStorage, "user@example.com", true);
    expect(localStorage.getItem("login-email")).toBe("user@example.com");

    applyRememberEmail(localStorage, "user@example.com", false);
    expect(localStorage.getItem("login-email")).toBeNull();
  });

  it("clears password state when the hook mounts", async () => {
    useLoginStore.setState({ password: "leftover" });

    renderHook(() => useLoginPageLogic());

    expect(useLoginStore.getState().password).toBe("");
  });

  it("removes password traces after successful login while remembering email", async () => {
    apiLogin.mockResolvedValue({
      success: true,
      data: {
        accessToken: "token",
        refreshToken: "refresh",
        accessTokenExpiresIn: 1000,
      },
    });
    httpClient.get.mockResolvedValue({ success: true, data: { id: "u1" } });

    localStorage.setItem("password", "old");

    const { result } = renderHook(() => useLoginPageLogic());

    act(() => {
      result.current.handleEmailChange("user@example.com");
      result.current.handlePasswordChange("Secret!23");
      result.current.setField("remember", true);
    });

    await act(async () => {
      await result.current.handleEmailLogin();
    });

    expect(localStorage.getItem("login-email")).toBe("user@example.com");
    expect(localStorage.getItem("password")).toBeNull();
    expect(useLoginStore.getState().password).toBe("");
  });
});

describe("LoginForm UI visibility", () => {
  it("uses readable colors for text links and unlock action", () => {
    render(
      <LoginForm
        email=""
        password=""
        remember={false}
        errors={{ email: "", password: "", otp: "" }}
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
        onRememberChange={() => {}}
        onSubmit={() => {}}
        onUnlock={() => {}}
        isLoginDisabled={false}
        loginLoading={false}
      />
    );

    expect(
      screen.getByRole("link", { name: "회원가입" }).className
    ).toContain("text-indigo-600");
    expect(
      screen.getByRole("link", { name: "이메일 찾기" }).className
    ).toContain("text-indigo-600");
    expect(
      screen.getByText("본인인증으로 계정 잠금 해제").className
    ).toContain("text-indigo-600");
  });
});
