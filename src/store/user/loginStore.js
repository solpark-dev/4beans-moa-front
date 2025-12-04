import { create } from "zustand";

export const useLoginStore = create((set) => ({
  email: "",
  password: "",
  remember: false,

  setField: (key, value) => set({ [key]: value }),
}));
