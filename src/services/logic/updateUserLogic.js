import httpClient from "@/api/httpClient";

let currentProfileImageUrl = null;

async function doPassAuthForPhone() {
  const res = await httpClient.get("/users/pass/start");
  const { data } = res;
  const { impCode, merchantUid } = data;

  if (!window.IMP) {
    throw new Error("본인인증 모듈이 로드되지 않았습니다.");
  }

  return new Promise((resolve, reject) => {
    window.IMP.init(impCode);
    window.IMP.certification(
      {
        merchant_uid: merchantUid,
        popup: true,
        pg: "inicis_unified",
      },
      async function (rsp) {
        if (!rsp.success) {
          reject(new Error("본인인증 실패"));
          return;
        }

        try {
          const verify = await httpClient.post("/users/pass/verify", {
            imp_uid: rsp.imp_uid,
          });
          const { data } = verify;
          resolve(data);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

export function initUpdateUserPage() {
  const emailInput = document.getElementById("editEmail");
  const nicknameInput = document.getElementById("editNickname");
  const phoneInput = document.getElementById("editPhone");
  const profileInput = document.getElementById("editProfileImage");
  const profilePreview = document.getElementById("editProfilePreview");
  const btnPass = document.getElementById("btnEditPhonePass");
  const btnSave = document.getElementById("btnUpdateUser");

  if (!emailInput || !nicknameInput || !phoneInput || !btnSave) {
    return;
  }

  httpClient
    .get("/users/me")
    .then((res) => {
      if (!res.success || !res.data) {
        return;
      }
      const u = res.data;
      emailInput.value = u.email || "";
      nicknameInput.value = u.nickname || "";
      phoneInput.value = u.phone || "";
      currentProfileImageUrl = u.profileImage || null;

      if (currentProfileImageUrl && profilePreview) {
        profilePreview.src = currentProfileImageUrl;
        profilePreview.classList.remove("hidden");
      }
    })
    .catch(() => { });

  if (profileInput && profilePreview && !profileInput.dataset.boundPreview) {
    profileInput.addEventListener("change", () => {
      const file = profileInput.files[0];
      if (!file) {
        return;
      }
      const url = URL.createObjectURL(file);
      profilePreview.src = url;
      profilePreview.classList.remove("hidden");
    });
    profileInput.dataset.boundPreview = "true";
  }

  if (btnPass && !btnPass.dataset.boundPass) {
    btnPass.addEventListener("click", async () => {
      try {
        const data = await doPassAuthForPhone();
        if (phoneInput) {
          phoneInput.value = data.phone;
        }
        alert("본인인증 성공. 휴대폰 번호가 변경되었습니다.");
      } catch (err) {
        console.log(err);
        alert(err.message || "본인인증 중 오류가 발생했습니다.");
      }
    });
    btnPass.dataset.boundPass = "true";
  }

  if (!btnSave.dataset.boundSave) {
    btnSave.addEventListener("click", async () => {
      const nickname = nicknameInput.value.trim();
      const phone = phoneInput.value.trim();

      if (!nickname) {
        alert("닉네임을 입력해 주세요.");
        return;
      }

      if (!phone) {
        alert("휴대폰 번호를 입력해 주세요.");
        return;
      }

      let profileUrl = currentProfileImageUrl;

      if (profileInput && profileInput.files[0]) {
        const form = new FormData();
        form.append("file", profileInput.files[0]);

        try {
          const uploadRes = await httpClient.post(
            "/users/uploadProfileImage",
            form,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (uploadRes.success) {
            profileUrl = uploadRes.data;
          } else {
            const msg =
              uploadRes.error?.message ||
              "프로필 이미지 업로드에 실패했습니다.";
            alert(msg);
            return;
          }
        } catch (e) {
          console.log(e);
          alert("프로필 이미지 업로드 중 오류가 발생했습니다.");
          return;
        }
      }

      try {
        const res = await httpClient.post("/users/update", {
          nickname,
          phone,
          profileImage: profileUrl,
        });

        if (res.success) {
          alert("회원정보가 수정되었습니다.");
          window.location.href = "/mypage";
        } else {
          const msg =
            res.error?.message || "회원정보 수정에 실패했습니다.";
          alert(msg);
        }
      } catch (err) {
        console.log(err);
        const msg =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "회원정보 수정 중 오류가 발생했습니다.";
        alert(msg);
      }
    });

    btnSave.dataset.boundSave = "true";
  }
}
