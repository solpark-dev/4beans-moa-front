// src/store/admin/blacklistStore.js
import { create } from "zustand";

export const useBlacklistStore = create((set) => ({
  userId: "",
  reasonType: "FRAUD",
  reasonDetail: "",

  setUserId: (v) => set({ userId: v }),
  setReasonType: (v) => set({ reasonType: v }),
  setReasonDetail: (v) => set({ reasonDetail: v }),
}));
