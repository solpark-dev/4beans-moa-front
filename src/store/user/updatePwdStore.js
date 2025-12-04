// src/store/user/updatePwdStore.js
import { create } from "zustand";

export const useUpdatePwdStore = create((set) => ({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
  modalOpen: true,
  stepVerified: false,
  error: {
    current: "",
    rule: "",
    confirm: "",
  },

  setField: (key, value) => set({ [key]: value }),

  setError: (field, msg) =>
    set((s) => ({
      error: {
        ...s.error,
        [field]: msg,
      },
    })),

  setModal: (v) => set({ modalOpen: v }),
  setVerified: (v) => set({ stepVerified: v }),
}));
