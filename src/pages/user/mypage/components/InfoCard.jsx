import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InfoCard({ title, icon, children }) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm h-full rounded-2xl">
      <CardHeader className="pb-4 border-b border-slate-200">
        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em] flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">{children}</CardContent>
    </Card>
  );
}

export function InfoRow({ label, value, valueClass = "text-slate-900" }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
