import { create } from "zustand";

export const useSignupStore = create((set) => ({
  email: "",
  password: "",
  passwordCheck: "",
  nickname: "",
  phone: "",
  marketingAgree: false,
  profileImage: null,

  setField: (key, value) => set({ [key]: value }),
}));
