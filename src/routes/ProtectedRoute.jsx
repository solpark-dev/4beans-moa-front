import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";

const LoadingFallback = () => (
  <div className="w-full flex items-center justify-center py-20">
    <span className="text-sm text-slate-500">Checking session...</span>
  </div>
);

export default function ProtectedRoute({ element }) {
  const { user, loading, fetchSession } = useAuthStore();
  const hasRequestedSession = useRef(false);

  useEffect(() => {
    if (!user && !hasRequestedSession.current) {
      hasRequestedSession.current = true;
      fetchSession().finally(() => {
        useAuthStore.setState({ loading: false });
      });
    }
  }, [user, fetchSession]);

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
}

