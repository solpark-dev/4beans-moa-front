import { Button } from "@/components/ui/button";

export function MenuButton({
  icon,
  label,
  onClick,
  variant = "default",
  active = false,
}) {
  const isDestructive = variant === "destructive";
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`
        w-full justify-start h-12 px-4 text-sm font-bold rounded-xl
        border-2 transition-all duration-200
        ${
          active
            ? "bg-indigo-600 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            : "bg-white text-slate-800 border-black hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]"
        }
        ${
          isDestructive
            ? "text-red-600 hover:bg-red-50 border-black"
            : ""
        }
      `}
    >
      <span className="mr-3 opacity-80">{icon}</span>
      {label}
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
      )}
    </Button>
  );
}
