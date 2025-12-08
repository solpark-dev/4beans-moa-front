import { useParams } from "react-router-dom";
import { useAdminLoginHistory } from "@/hooks/admin/useAdminLoginHistory";
import AdminLoginHistoryCard from "./components/AdminLoginHistoryCard";

export default function AdminLoginHistoryPage() {
  const { userId } = useParams();
  const loginHistory = useAdminLoginHistory(userId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <AdminLoginHistoryCard loginHistory={loginHistory} />
      </div>
    </div>
  );
}
