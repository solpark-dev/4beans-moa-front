import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * NeoCard - 네오브루탈리즘 스타일 카드 컴포넌트
 *
 * @param {string} color - 배경색 클래스 (예: "bg-white", "bg-pink-500")
 * @param {number} rotate - 회전 각도 (기본값: 0)
 * @param {boolean} hoverable - 호버 효과 활성화 여부 (기본값: true)
 * @param {string} className - 추가 클래스
 */
const NeoCard = React.forwardRef(
  ({ children, color = "bg-white", rotate = 0, hoverable = true, className, ...props }, ref) => {
    const Component = hoverable ? motion.div : "div";
    const motionProps = hoverable ? {
      whileHover: { scale: 1.1, rotate: rotate + 5 },
      whileTap: { scale: 0.95 }
    } : {};

    return (
      <Component
        ref={ref}
        {...motionProps}
        className={cn(
          color,
          "border-4 border-black",
          "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
          hoverable && "hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
          hoverable && "hover:translate-x-[3px] hover:translate-y-[3px]",
          hoverable && "transition-all duration-200",
          className
        )}
        style={{ transform: `rotate(${rotate}deg)` }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

NeoCard.displayName = "NeoCard";

export { NeoCard };
