import { useAuthStore } from "@/store/authStore";

export default function AdminAuthGuard({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">권한 확인 중...</p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-red-500">관리자 권한이 필요합니다.</p>
      </div>
    );
  }

  return children;
}
