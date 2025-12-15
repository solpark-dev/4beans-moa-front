import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Palette, Sparkles, TreePine } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

// ============================================
// Page Theme Configuration
// ============================================
export const themeConfig = {
  classic: {
    name: "Classic",
    icon: Sun,
    bg: "bg-white",
    heroBg: "bg-white",
    text: "text-gray-900",
    subtext: "text-gray-600",
    card: "bg-white border-gray-100 hover:border-gray-200",
    cardText: "text-gray-900",
    cardSubtext: "text-gray-500",
    accent: "#635bff",
    accentBg: "bg-[#635bff]",
    accentText: "text-[#635bff]",
    filterBg: "bg-white/80",
    filterBorder: "border-gray-100",
    inputBg: "bg-white",
    inputBorder: "border-gray-200",
    inputText: "text-gray-900",
    buttonActive: "bg-[#635bff] text-white",
    buttonInactive: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    sectionBg: "bg-gray-50",
    gradientText: "bg-gradient-to-r from-[#635bff] to-[#00d4ff] bg-clip-text text-transparent",
  },
  dark: {
    name: "Dark",
    icon: Moon,
    bg: "bg-[#0B1120]",
    heroBg: "bg-[#0B1120]",
    text: "text-white",
    subtext: "text-gray-400",
    card: "bg-[#1E293B] border-gray-700 hover:border-gray-600",
    cardText: "text-white",
    cardSubtext: "text-gray-400",
    accent: "#635bff",
    accentBg: "bg-[#635bff]",
    accentText: "text-[#635bff]",
    filterBg: "bg-[#1E293B]/80",
    filterBorder: "border-gray-700",
    inputBg: "bg-[#0F172A]",
    inputBorder: "border-gray-700",
    inputText: "text-white",
    buttonActive: "bg-[#635bff] text-white",
    buttonInactive: "bg-[#1E293B] text-gray-400 hover:bg-[#334155]",
    sectionBg: "bg-[#0F172A]",
    gradientText: "bg-gradient-to-r from-[#635bff] via-[#00d4ff] to-[#00d4ff] bg-clip-text text-transparent",
  },
  pop: {
    name: "Pop",
    icon: Palette,
    bg: "bg-slate-50",
    heroBg: "bg-slate-50",
    text: "text-black",
    subtext: "text-gray-600",
    card: "bg-white border-2 border-black",
    cardText: "text-black",
    cardSubtext: "text-gray-600",
    accent: "#ec4899",
    accentBg: "bg-pink-500",
    accentText: "text-pink-500",
    filterBg: "bg-white",
    filterBorder: "border-2 border-black",
    inputBg: "bg-white",
    inputBorder: "border-2 border-black",
    inputText: "text-black",
    buttonActive: "bg-pink-500 text-white border-2 border-black",
    buttonInactive: "bg-white text-black border-2 border-black hover:bg-pink-100",
    sectionBg: "bg-white",
    gradientText: "text-pink-500",
  },
  portrait: {
    name: "Portrait",
    icon: Sparkles,
    bg: "bg-gradient-to-br from-[#FDF8F3] via-[#FFF5F7] to-[#F5F0FF]",
    heroBg: "bg-transparent",
    text: "text-[#3d3d3d]",
    subtext: "text-[#888]",
    card: "bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white/80 hover:shadow-2xl shadow-lg",
    cardText: "text-[#4a4a4a]",
    cardSubtext: "text-[#888]",
    accent: "#FFB5C5",
    accentBg: "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF]",
    accentText: "text-pink-400",
    filterBg: "bg-white/40 backdrop-blur-xl",
    filterBorder: "border border-white/60",
    inputBg: "bg-white/60",
    inputBorder: "border border-white/60",
    inputText: "text-gray-700",
    buttonActive: "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] text-white shadow-lg shadow-pink-200/50",
    buttonInactive: "bg-white/50 text-[#888] hover:bg-white/70 border border-white/40",
    sectionBg: "bg-white/30",
    gradientText: "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] bg-clip-text text-transparent",
  },
  christmas: {
    name: "Christmas",
    icon: TreePine,
    // Variant T style base with Christmas colors - transparent to show snowflakes
    bg: "bg-transparent",
    heroBg: "bg-transparent",
    text: "text-gray-900",
    subtext: "text-gray-600",
    card: "bg-white border-gray-100 hover:border-[#c41e3a]/30 hover:shadow-xl",
    cardText: "text-gray-900",
    cardSubtext: "text-gray-500",
    accent: "#c41e3a",
    accentBg: "bg-[#c41e3a]",
    accentText: "text-[#c41e3a]",
    filterBg: "bg-white/80",
    filterBorder: "border-gray-100",
    inputBg: "bg-white",
    inputBorder: "border-gray-200",
    inputText: "text-gray-900",
    buttonActive: "bg-[#c41e3a] text-white shadow-lg shadow-[#c41e3a]/25",
    buttonInactive: "bg-gray-100 text-gray-600 hover:bg-[#c41e3a]/10 hover:text-[#c41e3a]",
    sectionBg: "bg-gray-50",
    gradientText: "bg-gradient-to-r from-[#c41e3a] to-[#1a5f2a] bg-clip-text text-transparent",
  },
};

// ============================================
// Header Theme Configuration
// ============================================
export const headerThemes = {
  classic: {
    // Header container
    bg: "bg-white/95 backdrop-blur-xl",
    border: "border-gray-200/80",
    borderWidth: "border-b",
    // Text colors
    text: "text-gray-900",
    subtext: "text-gray-600",
    // Logo
    logoBg: "bg-white",
    logoBorder: "border border-gray-200",
    logoShadow: "shadow-sm hover:shadow-md",
    logoText: "text-gray-900",
    // Sticker/Card components
    stickerBg: "bg-white",
    stickerBorder: "border border-gray-200",
    stickerShadow: "shadow-sm hover:shadow-md",
    stickerText: "text-gray-900",
    // Menu button
    menuBg: "bg-[#635bff]",
    menuText: "text-white",
    menuBorder: "",
    // Dropdown
    dropdownBg: "bg-white",
    dropdownBorder: "border border-gray-200",
    dropdownShadow: "shadow-xl",
    dropdownItemBg: "bg-gray-50",
    dropdownItemHover: "hover:bg-gray-100",
    dropdownItemText: "text-gray-900",
    dropdownItemSubtext: "text-gray-600",
    // Accent
    accent: "#635bff",
    accentBg: "bg-[#635bff]",
    accentText: "text-white",
    // Separator
    separatorColor: "bg-gray-200",
    // Switch
    switchChecked: "data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300",
    // Avatar
    avatarBorder: "border-2 border-black bg-slate-50",
    avatarFallback: "bg-cyan-400 text-black",
  },
  dark: {
    // Header container
    bg: "bg-[#0B1120]/95 backdrop-blur-xl",
    border: "border-gray-700/50",
    borderWidth: "border-b",
    // Text colors
    text: "text-white",
    subtext: "text-gray-400",
    // Logo
    logoBg: "bg-gray-800",
    logoBorder: "border border-gray-600",
    logoShadow: "shadow-lg shadow-black/20",
    logoText: "text-white",
    // Sticker/Card components
    stickerBg: "bg-gray-800",
    stickerBorder: "border border-gray-600",
    stickerShadow: "shadow-lg shadow-black/20",
    stickerText: "text-white",
    // Menu button
    menuBg: "bg-[#635bff]",
    menuText: "text-white",
    menuBorder: "border border-[#635bff]/50",
    // Dropdown
    dropdownBg: "bg-[#1E293B]",
    dropdownBorder: "border border-gray-600",
    dropdownShadow: "shadow-2xl shadow-black/50",
    dropdownItemBg: "bg-gray-700/50",
    dropdownItemHover: "hover:bg-gray-600/50",
    dropdownItemText: "text-white",
    dropdownItemSubtext: "text-gray-400",
    // Accent
    accent: "#635bff",
    accentBg: "bg-[#635bff]",
    accentText: "text-white",
    // Separator
    separatorColor: "bg-gray-600",
    // Switch
    switchChecked: "data-[state=checked]:bg-[#635bff] data-[state=unchecked]:bg-gray-600",
    // Avatar
    avatarBorder: "border-2 border-gray-600 bg-gray-700",
    avatarFallback: "bg-[#635bff] text-white",
  },
  pop: {
    // Header container
    bg: "bg-slate-50",
    border: "border-black",
    borderWidth: "border-b-2",
    // Text colors
    text: "text-black",
    subtext: "text-gray-600",
    // Logo
    logoBg: "bg-white",
    logoBorder: "border-2 border-black",
    logoShadow: "",
    logoText: "text-black",
    // Sticker/Card components
    stickerBg: "bg-white",
    stickerBorder: "border-2 border-black",
    stickerShadow: "",
    stickerText: "text-black",
    // Menu button
    menuBg: "bg-pink-500",
    menuText: "text-white",
    menuBorder: "border-2 border-black",
    // Dropdown
    dropdownBg: "bg-white",
    dropdownBorder: "border-2 border-black",
    dropdownShadow: "",
    dropdownItemBg: "bg-white",
    dropdownItemHover: "hover:bg-pink-100",
    dropdownItemText: "text-black",
    dropdownItemSubtext: "text-gray-600",
    // Accent
    accent: "#ec4899",
    accentBg: "bg-pink-500",
    accentText: "text-white",
    // Separator
    separatorColor: "bg-black",
    // Switch
    switchChecked: "data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300",
    // Avatar
    avatarBorder: "border-2 border-black bg-slate-50",
    avatarFallback: "bg-cyan-400 text-black",
  },
  portrait: {
    // Header container
    bg: "bg-gradient-to-r from-[#FDF8F3]/90 via-[#FFF5F7]/90 to-[#F5F0FF]/90 backdrop-blur-xl",
    border: "border-white/40",
    borderWidth: "border-b",
    // Text colors
    text: "text-gray-700",
    subtext: "text-gray-500",
    // Logo
    logoBg: "bg-white/70",
    logoBorder: "border border-pink-200/60",
    logoShadow: "shadow-lg shadow-pink-100/50",
    logoText: "text-gray-800",
    // Sticker/Card components
    stickerBg: "bg-white/70 backdrop-blur-sm",
    stickerBorder: "border border-pink-200/60",
    stickerShadow: "shadow-lg shadow-pink-100/50",
    stickerText: "text-gray-700",
    // Menu button
    menuBg: "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF]",
    menuText: "text-white",
    menuBorder: "border border-white/40",
    // Dropdown
    dropdownBg: "bg-white/95 backdrop-blur-xl",
    dropdownBorder: "border border-pink-200/60",
    dropdownShadow: "shadow-2xl shadow-pink-100/30",
    dropdownItemBg: "bg-white/50",
    dropdownItemHover: "hover:bg-pink-50/50",
    dropdownItemText: "text-gray-700",
    dropdownItemSubtext: "text-gray-500",
    // Accent
    accent: "#FFB5C5",
    accentBg: "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF]",
    accentText: "text-white",
    // Separator
    separatorColor: "bg-pink-200/50",
    // Switch
    switchChecked: "data-[state=checked]:bg-pink-400 data-[state=unchecked]:bg-pink-200",
    // Avatar
    avatarBorder: "border-2 border-pink-200 bg-white/50",
    avatarFallback: "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] text-white",
  },
  christmas: {
    // Header container - Variant T style with Christmas accent
    bg: "bg-white/95 backdrop-blur-xl",
    border: "border-gray-100/50",
    borderWidth: "border-b",
    // Text colors
    text: "text-gray-900",
    subtext: "text-gray-600",
    // Logo
    logoBg: "bg-white",
    logoBorder: "border border-gray-200",
    logoShadow: "shadow-sm hover:shadow-md",
    logoText: "text-gray-900",
    // Sticker/Card components
    stickerBg: "bg-white",
    stickerBorder: "border border-gray-200",
    stickerShadow: "shadow-sm hover:shadow-md",
    stickerText: "text-gray-900",
    // Menu button - Christmas red
    menuBg: "bg-[#c41e3a]",
    menuText: "text-white",
    menuBorder: "",
    // Dropdown
    dropdownBg: "bg-white",
    dropdownBorder: "border border-gray-200",
    dropdownShadow: "shadow-xl",
    dropdownItemBg: "bg-gray-50",
    dropdownItemHover: "hover:bg-[#c41e3a]/10",
    dropdownItemText: "text-gray-900",
    dropdownItemSubtext: "text-gray-600",
    // Accent - Christmas red
    accent: "#c41e3a",
    accentBg: "bg-[#c41e3a]",
    accentText: "text-white",
    // Separator
    separatorColor: "bg-gray-200",
    // Switch - Christmas colors
    switchChecked: "data-[state=checked]:bg-[#c41e3a] data-[state=unchecked]:bg-gray-300",
    // Avatar - Christmas green accent
    avatarBorder: "border-2 border-[#1a5f2a] bg-slate-50",
    avatarFallback: "bg-[#c41e3a] text-white",
  },
};

// ============================================
// NavPill Styles per Theme
// ============================================
export const navPillStyles = {
  classic: {
    base: "border border-gray-200 shadow-sm",
    active: "bg-[#635bff] text-white border-[#635bff] shadow-md shadow-[#635bff]/20",
    inactive: "bg-white text-gray-700 hover:bg-[#635bff] hover:text-white hover:border-[#635bff] hover:shadow-md hover:shadow-[#635bff]/20",
    iconBase: "border border-gray-200",
    iconActive: "bg-white text-[#635bff] border-transparent",
    iconInactive: "bg-gray-50 text-gray-600",
  },
  dark: {
    base: "border border-gray-600 shadow-lg shadow-black/10",
    active: "bg-[#635bff] text-white border-[#635bff] shadow-lg shadow-[#635bff]/30",
    inactive: "bg-gray-800 text-gray-200 hover:bg-[#635bff] hover:text-white hover:border-[#635bff] hover:shadow-lg hover:shadow-[#635bff]/30",
    iconBase: "border border-gray-600",
    iconActive: "bg-white text-[#635bff] border-transparent",
    iconInactive: "bg-gray-700 text-gray-300",
  },
  pop: {
    base: "border-2 border-black",
    active: "bg-pink-500 text-white",
    inactive: "bg-white text-black hover:bg-pink-100",
    iconBase: "border border-black",
    iconActive: "bg-white text-pink-500",
    iconInactive: "bg-slate-50 text-black",
  },
  portrait: {
    base: "border border-pink-200/60 shadow-md shadow-pink-100/30",
    active: "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] text-white border-transparent shadow-lg shadow-pink-200/40",
    inactive: "bg-white/70 backdrop-blur-sm text-gray-600 hover:bg-gradient-to-r hover:from-[#FFB5C5] hover:to-[#C5B5FF] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-pink-200/40",
    iconBase: "border border-pink-200/60",
    iconActive: "bg-white text-pink-400 border-transparent",
    iconInactive: "bg-white/50 text-gray-500",
  },
  christmas: {
    // Variant T style with Christmas red accent
    base: "border border-gray-200 shadow-sm",
    active: "bg-[#c41e3a] text-white border-[#c41e3a] shadow-md shadow-[#c41e3a]/20",
    inactive: "bg-white text-gray-700 hover:bg-[#c41e3a] hover:text-white hover:border-[#c41e3a] hover:shadow-md hover:shadow-[#c41e3a]/20",
    iconBase: "border border-gray-200",
    iconActive: "bg-white text-[#c41e3a] border-transparent",
    iconInactive: "bg-gray-50 text-gray-600",
  },
};

// ============================================
// Mobile Nav Item Styles per Theme
// ============================================
export const getMobileNavItemStyle = (theme) => {
  switch (theme) {
    case "dark":
      return "py-2.5 flex items-center justify-between gap-3 font-bold text-white rounded-2xl hover:bg-[#635bff] border border-gray-600 bg-gray-700/50 px-3 transition-all duration-200";
    case "portrait":
      return "py-2.5 flex items-center justify-between gap-3 font-bold text-gray-700 rounded-2xl hover:bg-gradient-to-r hover:from-[#FFB5C5] hover:to-[#C5B5FF] hover:text-white border border-pink-200/60 bg-white/50 px-3 transition-all duration-200";
    case "pop":
      return "py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-pink-500 hover:text-white border-2 border-black bg-white px-3 transition-all duration-200";
    case "christmas":
      return "py-2.5 flex items-center justify-between gap-3 font-semibold text-gray-900 rounded-2xl hover:bg-[#c41e3a] hover:text-white border border-gray-200 bg-gray-50 px-3 transition-all duration-200";
    default:
      return "py-2.5 flex items-center justify-between gap-3 font-semibold text-gray-900 rounded-2xl hover:bg-[#635bff] hover:text-white border border-gray-200 bg-gray-50 px-3 transition-all duration-200";
  }
};

// ============================================
// Background Components
// ============================================

// Classic Animated Gradient
export const AnimatedGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(99, 91, 255, 0.06) 0%, transparent 70%)",
        top: "-200px",
        right: "-100px",
      }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%)",
        bottom: "-100px",
        left: "-50px",
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Dark Theme Gradient
export const DarkGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute w-[800px] h-[800px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(99, 91, 255, 0.15) 0%, transparent 70%)",
        top: "-200px",
        right: "-200px",
      }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(79, 209, 197, 0.1) 0%, transparent 70%)",
        bottom: "100px",
        left: "-100px",
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Portrait Theme Background
export const PortraitBackground = () => (
  <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none -z-10 overflow-hidden">
    <motion.div
      className="absolute w-[800px] h-[800px] rounded-full opacity-30"
      style={{
        background: "radial-gradient(circle, rgba(255, 181, 197, 0.6) 0%, transparent 70%)",
        top: "-20%",
        left: "10%",
      }}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 50, 0],
        y: [0, 30, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full opacity-30"
      style={{
        background: "radial-gradient(circle, rgba(197, 181, 255, 0.5) 0%, transparent 70%)",
        top: "30%",
        right: "5%",
      }}
      animate={{
        scale: [1, 1.1, 1],
        x: [0, -40, 0],
        y: [0, 40, 0],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[700px] h-[700px] rounded-full opacity-25"
      style={{
        background: "radial-gradient(circle, rgba(181, 212, 255, 0.4) 0%, transparent 70%)",
        bottom: "-10%",
        left: "20%",
      }}
      animate={{
        scale: [1, 1.15, 1],
        x: [0, 60, 0],
        y: [0, -30, 0],
      }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Christmas Theme Background - Subtle mint/cream background with snowflakes
export const ChristmasBackground = () => (
  <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none -z-10 overflow-hidden">
    {/* Subtle green/cream tinted background for snowflake visibility */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0e8] via-[#f0ebe5] to-[#e5ece8]" />

    {/* Variant T style gradient orbs with Christmas colors */}
    <motion.div
      className="absolute w-[800px] h-[800px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(196, 30, 58, 0.08) 0%, transparent 70%)",
        top: "-200px",
        right: "-200px",
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.7, 0.5],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(26, 95, 42, 0.08) 0%, transparent 70%)",
        bottom: "100px",
        left: "-100px",
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Falling snow - fluffy cotton-like dots with visible tint */}
    {[...Array(20)].map((_, i) => {
      // Pseudo-random positions using prime-based distribution
      const leftPos = ((i * 17 + 23) % 97) + ((i * 7) % 11) * 0.3;
      const size = 8 + (i % 4) * 4; // 8px to 20px

      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${leftPos}%`,
            top: "-20px",
            width: `${size}px`,
            height: `${size}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 40%, rgba(255, 255, 255, 0.3) 70%, transparent 100%)`,
            filter: "blur(0.5px)",
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.1), 0 0 ${size}px rgba(255, 255, 255, 0.5)`,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [
              0,
              Math.sin(i * 0.7 + 1.3) * 60 * (i % 2 === 0 ? 1 : -1),
              Math.cos(i * 0.5 + 0.8) * 40 * (i % 2 === 0 ? -1 : 1),
              Math.sin(i * 0.3) * 30,
              0
            ],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 16 + (i % 7) * 2.7, // ~10% faster: 16s to 35s
            repeat: Infinity,
            delay: (i * 1.3) + Math.sin(i) * 2, // More varied delays
            ease: "linear",
          }}
        />
      );
    })}
  </div>
);

// Grid Pattern
export const GridPattern = ({ dark = false }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${dark ? "opacity-[0.1]" : "opacity-[0.02]"}`}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className={dark ? "text-gray-500" : ""} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

// ============================================
// Theme Background Renderer
// ============================================
export const ThemeBackground = ({ theme }) => {
  switch (theme) {
    case "dark":
      return (
        <>
          <DarkGradient />
          <GridPattern dark />
        </>
      );
    case "portrait":
      return <PortraitBackground />;
    case "christmas":
      return <ChristmasBackground />;
    case "pop":
      return <GridPattern />;
    default:
      return (
        <>
          <AnimatedGradient />
          <GridPattern />
        </>
      );
  }
};

// ============================================
// Theme Switcher Component (Radial Menu)
// ============================================
export const ThemeSwitcher = ({ theme, onThemeChange }) => {
  // Internal state for menu open/close
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-44 right-4 z-50">
      {/* Main Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-full shadow-xl transition-all duration-300 ${theme === "dark"
          ? "bg-gray-800 text-white border border-gray-600"
          : theme === "pop"
            ? "bg-pink-500 text-white border-2 border-black"
            : theme === "portrait"
              ? "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] text-white"
              : theme === "christmas"
                ? "bg-[#c41e3a] text-white shadow-lg shadow-[#c41e3a]/25"
                : "bg-white text-gray-700 border border-gray-200 shadow-lg"
          }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Expandable Theme Options - Radial Layout */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[-1]"
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Options - Circular Layout */}
            {Object.entries(themeConfig).map(([key, config], index) => {
              const IconComponent = config.icon;
              const isActive = theme === key;
              const totalItems = Object.keys(themeConfig).length;
              const angle = (Math.PI / 2) + (index / totalItems) * Math.PI;
              const radius = 60;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: x,
                    y: y,
                  }}
                  exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onThemeChange(key);
                    setIsOpen(false);
                  }}
                  className={`absolute top-0 right-0 p-2.5 rounded-full shadow-lg transition-colors duration-200 ${isActive
                    ? key === "pop"
                      ? "bg-pink-500 text-white border-2 border-black"
                      : key === "portrait"
                        ? "bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] text-white"
                        : key === "dark"
                          ? "bg-gray-800 text-white border border-gray-500"
                          : key === "christmas"
                            ? "bg-[#c41e3a] text-white"
                            : "bg-[#635bff] text-white"
                    : key === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-500"
                      : key === "christmas"
                        ? "bg-white text-[#c41e3a] hover:bg-[#c41e3a]/10 border border-gray-200"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  title={config.name}
                >
                  <IconComponent className="w-4 h-4" />
                </motion.button>
              );
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// Header Sticker Component
// ============================================
export const HeaderSticker = ({ children, theme = "classic", className = "" }) => {
  const themeStyle = headerThemes[theme] || headerThemes.classic;

  return (
    <div
      className={`${themeStyle.stickerBg} ${themeStyle.stickerBorder} ${themeStyle.stickerShadow} transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
};

// ============================================
// useTheme Hook (Convenience wrapper)
// ============================================
export const useTheme = () => {
  const { theme, setTheme } = useThemeStore();
  const currentTheme = themeConfig[theme] || themeConfig.classic;

  return {
    theme,
    setTheme,
    currentTheme,
  };
};

// ============================================
// Theme Marquee Component (for pop theme)
// ============================================
export const ThemeMarquee = ({ theme, children, direction = "left", speed = 20 }) => {
  // Only show marquee for pop theme
  if (theme !== "pop") return null;

  // Default content if no children provided
  const content = children || (
    <div className="flex items-center gap-8 text-black font-black text-sm uppercase tracking-widest px-8">
      <span>★ OTT 공유</span>
      <span>★ 최대 75% 절약</span>
      <span>★ 안전한 파티</span>
      <span>★ 간편 결제</span>
      <span>★ OTT 공유</span>
      <span>★ 최대 75% 절약</span>
      <span>★ 안전한 파티</span>
      <span>★ 간편 결제</span>
    </div>
  );

  return (
    <div className="bg-yellow-300 border-y-2 border-black py-2 overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="inline-flex"
      >
        {content}
        {content}
      </motion.div>
    </div>
  );
};

// ============================================
// Sticker Component (Pop style element)
// ============================================
export const Sticker = ({ children, color = "bg-white", rotate = 0, className = "", onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: rotate + 2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${color} border-2 border-black transition-all duration-200 ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </motion.div>
);
