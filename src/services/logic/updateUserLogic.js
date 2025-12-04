// src/services/logic/updateUserLogic.js
import httpClient from "@/api/httpClient";
import { useUpdateUserStore } from "@/store/user/updateUserStore";

export async function loadUserInfo() {
  try {
    const res = await httpClient.get("/users/me");

    if (res.success && res.data) {
      useUpdateUserStore.getState().setUserData(res.data);
    } else {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
    }
  } catch {
    alert("로그인이 필요합니다.");
    window.location.href = "/login";
  }
}

export function handleImageChange(file) {
  if (!file) return;

  const url = URL.createObjectURL(file);
  useUpdateUserStore.getState().setField("previewImage", url);
}

export async function uploadProfileImage(file) {
  if (!file) return null;

  const form = new FormData();
  form.append("file", file);

  const res = await httpClient.post("/users/uploadProfileImage", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (res.success) return res.data;
  throw new Error(res.error?.message || "프로필 업로드 실패");
}

export async function doPassVerification() {
  const res = await httpClient.get("/users/pass/start");
  const { impCode, merchantUid } = res.data;

  return new Promise((resolve, reject) => {
    if (!window.IMP) {
      reject(new Error("본인인증 모듈이 로드되지 않았습니다."));
      return;
    }

    window.IMP.init(impCode);
    window.IMP.certification(
      { merchant_uid: merchantUid, popup: true, pg: "inicis_unified" },

      async function (rsp) {
        if (!rsp.success) {
          reject(new Error("본인인증 실패"));
          return;
        }

        try {
          const verify = await httpClient.post("/users/pass/verify", {
            imp_uid: rsp.imp_uid,
          });
          resolve(verify.data);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

export async function saveUserInfo({ nickname, phone, file }) {
  let profileUrl = useUpdateUserStore.getState().profileImage || null;

  if (file) {
    profileUrl = await uploadProfileImage(file);
  }

  const res = await httpClient.post("/users/update", {
    nickname,
    phone,
    profileImage: profileUrl,
  });

  if (!res.success) throw new Error(res.error?.message || "회원정보 수정 실패");

  return true;
}
