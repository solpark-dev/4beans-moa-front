import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InfoCard({ title, icon, children }) {
  return (
    <Card className="bg-white border border-gray-100 shadow-2xl h-full rounded-3xl">
      <CardHeader className="pb-4 px-6 pt-6 border-b border-gray-100">
        <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">{children}</CardContent>
    </Card>
  );
}

export function InfoRow({ label, value, valueClass = "text-slate-900" }) {
  return (
    <div className="flex justify-between items-start py-1.5">
      <span className="text-xs md:text-sm font-medium text-gray-700">
        {label}
      </span>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
