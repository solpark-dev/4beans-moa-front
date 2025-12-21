export const PASS_KEYS = {
  IMP_UID: "PASS_IMP_UID",
  PURPOSE: "PASS_PURPOSE",
};

export const buildPassRedirectUrl = ({ purpose, returnTo } = {}) => {
  const origin = window.location.origin;
  const url = new URL(`${origin}/auth/pass/redirect`);
  if (purpose) url.searchParams.set("purpose", purpose);
  if (returnTo) url.searchParams.set("return_to", returnTo);
  return url.toString();
};

export const consumePassImpUid = (purpose) => {
  try {
    const savedPurpose = sessionStorage.getItem(PASS_KEYS.PURPOSE) || "";
    const impUid = sessionStorage.getItem(PASS_KEYS.IMP_UID) || "";

    if (!impUid) return null;
    if (purpose && savedPurpose !== purpose) return null;

    sessionStorage.removeItem(PASS_KEYS.IMP_UID);
    sessionStorage.removeItem(PASS_KEYS.PURPOSE);

    return impUid;
  } catch {
    return null;
  }
};

export const stashSession = (key, value) => {
  try {
    sessionStorage.setItem(key, value ?? "");
  } catch {}
};

export const readSession = (key) => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export const removeSession = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch {}
};
