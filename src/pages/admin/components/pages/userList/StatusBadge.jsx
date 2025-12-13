import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status, blacklisted }) {
  if (blacklisted) {
    return (
      <Badge className="bg-red-500 hover:bg-red-500 text-xs font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-full">
        블랙리스트
      </Badge>
    );
  }

  const styles = {
    BLOCK: "bg-orange-500",
    WITHDRAW: "bg-slate-400",
    PENDING: "bg-yellow-400 text-slate-900",
    ACTIVE: "bg-emerald-500",
  };
  const labels = {
    BLOCK: "이용제한",
    WITHDRAW: "탈퇴",
    PENDING: "미인증",
    ACTIVE: "정상",
  };
  const key = status === "ACTIVE" || !styles[status] ? "ACTIVE" : status;

  return (
    <Badge
      className={`${styles[key]} hover:${styles[key]} text-xs font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-full`}
    >
      {labels[key]}
    </Badge>
  );
}
