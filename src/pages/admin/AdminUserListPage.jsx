import { useAdminUserListLogic } from "@/hooks/admin/useAdminUserList";
import UserListBackground from "./components/pages/userList/UserListBackground";
import UserListHero from "./components/pages/userList/UserListHero";
import UserListTableCard from "./components/pages/userList/UserListTableCard";

export default function AdminUserListPage() {
  const {
    users,
    page,
    sort,
    totalPages,
    totalCount,
    filters,
    searchValue,
    loading,
    error,
    pageNumbers,

    handlers,

    utils: { formatDate },
  } = useAdminUserListLogic();

  return (
    <div className="min-h-screen bg-slate-50 text-black overflow-hidden">
      <UserListBackground />
      <UserListHero totalCount={totalCount} />
      <UserListTableCard
        users={users}
        page={page}
        sort={sort}
        totalPages={totalPages}
        totalCount={totalCount}
        filters={filters}
        searchValue={searchValue}
        loading={loading}
        error={error}
        pageNumbers={pageNumbers}
        handlers={handlers}
        formatDate={formatDate}
      />
    </div>
  );
}
