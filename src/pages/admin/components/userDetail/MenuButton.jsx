import { Button } from "@/components/ui/button";

export default function MenuButton({ icon, label, onClick, active = false }) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start h-11 px-4 text-sm font-bold rounded-2xl border-2 transition-colors ${
        active
          ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-900"
          : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
      {active && <span className="ml-auto text-xs">●</span>}
    </Button>
  );
}
