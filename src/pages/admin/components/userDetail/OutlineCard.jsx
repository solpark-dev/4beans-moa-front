import { Card } from "@/components/ui/card";

export default function OutlineCard({ className = "", children }) {
  return (
    <Card
      className={`bg-white border-2 border-slate-900 rounded-3xl shadow-[0_10px_0_rgba(0,0,0,0.06)] ${className}`}
    >
      {children}
    </Card>
  );
}
