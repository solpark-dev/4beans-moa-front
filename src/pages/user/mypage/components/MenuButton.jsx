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
        border transition-all duration-200
        ${
          active
            ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
            : "bg-white text-slate-800 border-gray-200 hover:bg-gray-50"
        }
        ${isDestructive ? "text-red-600 hover:bg-red-50 border-red-200" : ""}
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
