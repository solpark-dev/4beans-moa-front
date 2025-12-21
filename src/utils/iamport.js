export const loadIamport = () =>
  new Promise((resolve, reject) => {
    if (window.IMP) {
      resolve(window.IMP);
      return;
    }

    const existing = document.querySelector('script[data-iamport="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.IMP), {
        once: true,
      });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    script.defer = true;
    script.dataset.iamport = "true";
    script.onload = () => resolve(window.IMP);
    script.onerror = reject;
    document.body.appendChild(script);
  });
