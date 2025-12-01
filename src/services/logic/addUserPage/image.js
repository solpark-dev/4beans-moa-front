// src/services/logic/addUserPage/image.js

export function bindImageEvents() {
  const input = document.getElementById("signupProfileImage");
  const preview = document.getElementById("signupProfilePreview");

  if (input && !input.dataset.boundPreview) {
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      preview.src = url;
      preview.classList.remove("hidden");
    });

    input.dataset.boundPreview = "true";
  }
}

export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
