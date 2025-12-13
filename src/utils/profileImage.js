export const resolveProfileImageUrl = (profileImage) => {
  if (!profileImage) return "";
  if (profileImage.startsWith("http")) return profileImage;

  const base =
    (import.meta.env.VITE_API_BASE_URL || "").replace(/\/api\/?$/, "") ||
    "https://localhost:8443";
  const path = profileImage.startsWith("/") ? profileImage : `/${profileImage}`;

  return `${base}${path}`;
};
