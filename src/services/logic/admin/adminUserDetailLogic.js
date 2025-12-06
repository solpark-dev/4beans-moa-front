import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminUserDetail } from "@/api/adminUserApi";
import { useAdminUserDetailStore } from "@/store/admin/adminUserDetailStore";
import { myPageHandlers } from "@/services/logic/myPageLogic";

export const useAdminUserDetailLogic = (userId) => {
    const navigate = useNavigate();
    const { user, loading, error, setUser, setLoading, setError } =
        useAdminUserDetailStore();

    const handlers = myPageHandlers();

    const loadUser = async () => {
        try {
            setLoading(true);
            setError(null);

            const body = await fetchAdminUserDetail(userId);

            if (!body.success) {
                throw new Error(
                    body.error?.message || "회원 정보를 불러오지 못했습니다."
                );
            }

            setUser(body.data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadUser();
        }
    }, [userId]);

    const goBackList = () => navigate("/admin/users");
    const goBlacklistAdd = () => handlers.goBlacklistAdd(userId);
    const goLoginHistory = () =>
        navigate(`/admin/users/${encodeURIComponent(userId)}/login-history`);

    return {
        user,
        loading,
        error,
        formatDate: handlers.formatDate,
        goBackList,
        goBlacklistAdd,
        goLoginHistory,
    };
};
