// src/store/user/updateUserStore.js
import { create } from "zustand";

export const useUpdateUserStore = create((set) => ({
  email: "",
  nickname: "",
  phone: "",
  profileImage: "",
  previewImage: "",

  setField: (key, value) => set({ [key]: value }),

  setUserData: (user) =>
    set({
      email: user.userId || "",
      nickname: user.nickname || "",
      phone: user.phone || "",
      profileImage: user.profileImage || "",
      previewImage: user.profileImage || "",
    }),
}));
