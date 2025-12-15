import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * NeoButton - 네오브루탈리즘 스타일 버튼 컴포넌트
 *
 * @param {string} color - 배경색 클래스 (예: "bg-pink-500", "bg-white")
 * @param {string} size - 버튼 크기 ("sm" | "md" | "lg")
 * @param {string} className - 추가 클래스
 */
const NeoButton = React.forwardRef(
  ({ children, color = "bg-pink-500", size = "md", className, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-8 py-4 text-xl",
      lg: "px-12 py-6 text-2xl",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          color,
          sizeClasses[size],
          "font-black",
          "border-4 border-black",
          "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
          "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          "hover:translate-x-[4px] hover:translate-y-[4px]",
          "transition-all duration-200",
          "rounded-2xl",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

NeoButton.displayName = "NeoButton";

export { NeoButton };
