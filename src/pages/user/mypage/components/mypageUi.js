// src/pages/user/components/mypageUi.js
export const PANE_SHADOW = "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
export const BTN_SHADOW = "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]";

export const BTN_WHITE =
  "bg-white text-black border-2 border-black rounded-xl font-black " +
  BTN_SHADOW +
  " hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150";

export const BTN_WHITE_SM =
  "bg-white text-black border-2 border-black rounded-xl font-black px-4 py-2 text-sm " +
  BTN_SHADOW +
  " hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150";

export const BTN_WHITE_XS =
  "bg-white text-black border-2 border-black rounded-xl font-black px-3 py-2 text-xs " +
  BTN_SHADOW +
  " hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150";

export const TAG_PILL =
  "inline-flex items-center justify-center rounded-full border-2 border-black px-3 py-1 text-xs font-black bg-white";

export const safeCall = (...fns) => {
  for (const fn of fns) {
    if (typeof fn === "function") return fn();
  }
  return undefined;
};
