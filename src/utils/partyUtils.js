export const getStatusBadge = (party, theme) => {
  const { partyStatus, maxMembers, currentMembers } = party;
  const remainingSlots = (maxMembers || 0) - (currentMembers || 0);

  if (partyStatus === 'RECRUITING' && remainingSlots === 1) {
    return {
      bg: "bg-gradient-to-r from-orange-500 to-red-500",
      text: "마감임박",
      pulse: true,
    };
  }

  const badges = {
    RECRUITING: {
      bg: theme === "pop" ? "bg-pink-500" : theme === "christmas" ? "bg-[#1a5f2a]" : "bg-[#635bff]",
      text: "모집중",
    },
    ACTIVE: {
      bg: "bg-emerald-500",
      text: "파티중",
    },
    PENDING_PAYMENT: {
      bg: "bg-amber-500",
      text: "결제대기",
    },
    CLOSED: {
      bg: "bg-gray-400",
      text: "파티종료",
    },
  };
  return badges[partyStatus] || badges.RECRUITING;
};

export const formatDate = (dateData) => {
  if (!dateData) return "-";

  if (Array.isArray(dateData)) {
    const [year, month, day] = dateData;
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  }

  const date = new Date(dateData);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};
