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
        w-full justify-start h-11 px-4 text-sm font-medium rounded-lg
        transition-all duration-200
        ${
          active
            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
        }
        ${
          isDestructive ? "text-red-600 hover:text-red-700 hover:bg-red-50" : ""
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
