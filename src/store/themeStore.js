import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Theme Store with localStorage persistence
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current theme: 'classic' | 'dark' | 'pop' | 'portrait'
      theme: "classic",

      // Set theme
      setTheme: (theme) => {
        set({ theme });
        // Also update legacy localStorage key for backward compatibility
        localStorage.setItem("partyListTheme", theme);
      },

      // Get current theme
      getTheme: () => get().theme,

      // Cycle through themes
      cycleTheme: () => {
        const themes = ["classic", "dark", "pop", "portrait"];
        const currentIndex = themes.indexOf(get().theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        get().setTheme(themes[nextIndex]);
      },
    }),
    {
      name: "app-theme-storage",
      storage: createJSONStorage(() => localStorage),
      // Migrate from legacy localStorage key
      onRehydrateStorage: () => (state) => {
        if (state) {
          const legacyTheme = localStorage.getItem("partyListTheme");
          if (legacyTheme && legacyTheme !== state.theme) {
            state.setTheme(legacyTheme);
          }
        }
      },
    }
  )
);
