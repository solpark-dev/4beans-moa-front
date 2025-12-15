import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import {
    Loader2,
    DollarSign,
    Users,
    PartyPopper,
    TrendingUp,
    TrendingDown,
    Wallet,
    CreditCard,
    Clock,
    UserPlus,
    Activity,
    ArrowRight,
    Calendar,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    BarChart3,
    Search,
    Filter,
    Bell,
    Target,
    XCircle,
} from "lucide-react";
import Chart from "react-apexcharts";

// Animated Background Gradient
const AnimatedGradient = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
            className="absolute w-[800px] h-[800px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(99, 91, 255, 0.08) 0%, transparent 70%)",
                top: "-200px",
                right: "-200px",
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(0, 212, 255, 0.06) 0%, transparent 70%)",
                bottom: "100px",
                left: "-100px",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

// Grid Pattern
const GridPattern = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg width="100%" height="100%">
            <defs>
                <pattern id="adminGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#adminGrid)" />
        </svg>
    </div>
);

// Period Filter Component
const PeriodFilter = ({ selected, onChange }) => {
    const options = [
        { value: "today", label: "오늘" },
        { value: "7days", label: "7일" },
        { value: "30days", label: "30일" },
        { value: "all", label: "전체" },
    ];

    return (
        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${selected === opt.value
                        ? "bg-[#635bff] text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

// Enhanced Stat Card with Trend
const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
    >
        <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 transition-transform duration-300 group-hover:scale-150"
            style={{ background: color }}
        />
        <div className="relative">
            <div className="flex items-center justify-between mb-3">
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${color}15` }}
                >
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-bold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
            <div className="text-xl font-black text-gray-900">{value}</div>
            {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
        </div>
    </motion.div>
);

// Alert Item Component
const AlertItem = ({ type, title, message, time }) => {
    const typeConfig = {
        error: { bg: "bg-red-50", border: "border-red-200", icon: XCircle, iconColor: "text-red-500" },
        warning: { bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle, iconColor: "text-amber-500" },
        info: { bg: "bg-blue-50", border: "border-blue-200", icon: Bell, iconColor: "text-blue-500" },
    };
    const config = typeConfig[type] || typeConfig.info;
    const IconComponent = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} border ${config.border}`}
        >
            <IconComponent className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
            <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{title}</div>
                <div className="text-xs text-gray-600 truncate">{message}</div>
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">{time}</div>
        </motion.div>
    );
};

// Quick Action Button
const QuickActionButton = ({ icon: Icon, label, to, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay }}
    >
        <Link
            to={to}
            className="group flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: `${color}15` }}
            >
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </Link>
    </motion.div>
);

// OTT Service Stats with Progress
const OttServiceStats = ({ stats }) => {
    if (!stats || stats.length === 0) return null;

    const colors = {
        'Netflix': '#E50914',
        'Disney+': '#113CCF',
        'Wavve': '#1351F9',
        'Watcha': '#FF0558',
        'TVING': '#FF153C',
        'Coupang Play': '#5F0080',
    };

    return (
        <div className="space-y-3">
            {stats.slice(0, 5).map((ott, index) => (
                <motion.div
                    key={ott.ottName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                >
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: colors[ott.ottName] || '#635bff' }}
                    >
                        {ott.ottName?.[0]}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{ott.ottName}</span>
                            <span className="text-xs text-gray-500">{ott.partyCount}개</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(ott.activeCount / Math.max(ott.partyCount, 1)) * 100}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="h-full rounded-full"
                                style={{ background: colors[ott.ottName] || '#635bff' }}
                            />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default function AdminDashboardPage() {
    const { stats, loading, error } = useAdminDashboard();
    const [period, setPeriod] = useState("7days");
    const [searchQuery, setSearchQuery] = useState("");

    // Mock alerts data (in real app, this would come from API)
    const alerts = useMemo(() => [
        { type: "error", title: "결제 실패", message: "user123 님의 20,000원 결제 실패", time: "5분 전" },
        { type: "warning", title: "만료 예정", message: "Netflix 파티 3개 이번 주 만료", time: "1시간 전" },
        { type: "info", title: "신규 가입", message: "오늘 신규 가입자 15명", time: "3시간 전" },
    ], []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-12 h-12 animate-spin text-[#635bff]" />
                    <p className="text-gray-500 font-medium">대시보드 로딩 중...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100"
                >
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">데이터 로드 실패</h2>
                    <p className="text-gray-500">통계 데이터를 불러오는데 실패했습니다.</p>
                </motion.div>
            </div>
        );
    }

    // ApexCharts - Revenue Line Chart
    const revenueLineOptions = {
        chart: { type: "area", toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
        stroke: { curve: "smooth", width: 3 },
        colors: ["#635bff"],
        fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
        xaxis: { categories: stats.dailyRevenues?.map(d => d.date?.slice(5)) || [] },
        yaxis: { labels: { formatter: (v) => `${(v / 1000000).toFixed(1)}M` } },
        tooltip: { y: { formatter: (v) => `${v?.toLocaleString()}원` } },
        grid: { borderColor: "#f0f0f0", strokeDashArray: 4 },
        dataLabels: { enabled: false },
    };

    const revenueLineSeries = [{
        name: "매출",
        data: stats.dailyRevenues?.map(d => d.amount) || [],
    }];

    // ApexCharts - Party Status Donut
    const partyDonutOptions = {
        chart: { type: "donut", animations: { enabled: true, speed: 800 } },
        colors: ["#10b981", "#635bff", "#94a3b8"],
        labels: ["활성", "모집중", "종료"],
        legend: { position: "bottom", fontSize: "12px" },
        plotOptions: { pie: { donut: { size: "70%", labels: { show: true, total: { show: true, label: "전체", formatter: () => stats.totalPartyCount || 0 } } } } },
        dataLabels: { enabled: false },
    };

    const partyDonutSeries = [
        stats.activePartyCount || 0,
        stats.recruitingPartyCount || 0,
        Math.max(0, (stats.totalPartyCount || 0) - (stats.activePartyCount || 0) - (stats.recruitingPartyCount || 0)),
    ];

    // ApexCharts - Monthly Revenue Bar Chart
    const monthlyBarOptions = {
        chart: { type: "bar", toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
        colors: ["#635bff"],
        plotOptions: { bar: { borderRadius: 8, columnWidth: "50%" } },
        xaxis: { categories: ["1월", "2월", "3월", "4월", "5월", "6월"] },
        yaxis: { labels: { formatter: (v) => `${(v / 1000000).toFixed(0)}M` } },
        tooltip: { y: { formatter: (v) => `${v?.toLocaleString()}원` } },
        grid: { borderColor: "#f0f0f0" },
        dataLabels: { enabled: false },
    };

    const monthlyBarSeries = [{
        name: "월 매출",
        data: [4500000, 3800000, 5200000, 4900000, 6100000, stats.thisMonthRevenue || 5500000],
    }];

    // ApexCharts - User Growth Area Chart
    const userGrowthOptions = {
        chart: { type: "area", toolbar: { show: false }, sparkline: { enabled: false } },
        stroke: { curve: "smooth", width: 2 },
        colors: ["#10b981", "#635bff"],
        fill: { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0.1 } },
        xaxis: { categories: ["1주", "2주", "3주", "4주"] },
        grid: { borderColor: "#f0f0f0" },
        legend: { position: "top" },
        dataLabels: { enabled: false },
    };

    const userGrowthSeries = [
        { name: "신규 가입", data: [45, 62, 55, stats.todayNewUsers ? stats.todayNewUsers * 7 : 78] },
        { name: "활성 사용자", data: [120, 145, 160, 180] },
    ];

    // ApexCharts - Radial Goal Gauge
    const goalGaugeOptions = {
        chart: { type: "radialBar" },
        colors: ["#635bff"],
        plotOptions: {
            radialBar: {
                hollow: { size: "70%" },
                track: { background: "#e7e7e7" },
                dataLabels: {
                    name: { fontSize: "14px", color: "#666" },
                    value: { fontSize: "24px", fontWeight: "bold", color: "#333" },
                },
            },
        },
        labels: ["목표 달성률"],
    };

    const goalPercentage = Math.min(100, Math.round(((stats.thisMonthRevenue || 0) / 10000000) * 100));

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <AnimatedGradient />
            <GridPattern />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Search and Period Filter */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900">관리자 대시보드</h1>
                                <p className="text-gray-500 text-sm">서비스 현황을 한눈에 확인하세요</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="사용자, 파티 검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff]"
                                />
                            </div>
                            {/* Period Filter */}
                            <PeriodFilter selected={period} onChange={setPeriod} />
                        </div>
                    </div>
                </motion.div>

                {/* Alerts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-[#635bff]" />
                            <h3 className="font-bold text-gray-900">실시간 알림</h3>
                        </div>
                        <span className="text-xs text-gray-500">최근 24시간</span>
                    </div>
                    <div className="space-y-2">
                        {alerts.map((alert, i) => (
                            <AlertItem key={i} {...alert} />
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions - moved up for quick access */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-6"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-3">빠른 작업</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        <QuickActionButton icon={Users} label="회원 관리" to="/admin/users" color="#635bff" delay={0} />
                        <QuickActionButton icon={PartyPopper} label="파티 목록" to="/party" color="#10b981" delay={0.05} />
                        <QuickActionButton icon={AlertCircle} label="블랙리스트" to="/admin/blacklist/add" color="#ef4444" delay={0.1} />
                        <QuickActionButton icon={Activity} label="공지사항" to="/community/notice" color="#f59e0b" delay={0.15} />
                        <QuickActionButton icon={Calendar} label="FAQ 관리" to="/community/faq" color="#8b5cf6" delay={0.2} />
                        <QuickActionButton icon={CreditCard} label="문의 관리" to="/community/inquiry/admin" color="#06b6d4" delay={0.25} />
                    </div>
                </motion.div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        icon={DollarSign}
                        title="총 매출"
                        value={`${(stats.totalRevenue || 0).toLocaleString()}원`}
                        subtitle="전체 누적"
                        color="#635bff"
                        trend={12}
                        delay={0}
                    />
                    <StatCard
                        icon={Wallet}
                        title="이번 달 매출"
                        value={`${(stats.thisMonthRevenue || 0).toLocaleString()}원`}
                        subtitle={`${stats.thisMonthPaymentCount || 0}건 결제`}
                        color="#00d4ff"
                        trend={8}
                        delay={0.1}
                    />
                    <StatCard
                        icon={Users}
                        title="총 회원"
                        value={`${(stats.totalUserCount || 0).toLocaleString()}명`}
                        subtitle={`오늘 +${stats.todayNewUsers || 0}명`}
                        color="#10b981"
                        trend={15}
                        delay={0.2}
                    />
                    <StatCard
                        icon={PartyPopper}
                        title="활성 파티"
                        value={`${stats.activePartyCount || 0}개`}
                        subtitle={`전체 ${stats.totalPartyCount || 0}개`}
                        color="#f59e0b"
                        trend={5}
                        delay={0.3}
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard icon={Activity} title="모집중 파티" value={`${stats.recruitingPartyCount || 0}개`} color="#8b5cf6" delay={0.4} />
                    <StatCard icon={Clock} title="결제 대기" value={`${stats.pendingPaymentCount || 0}건`} color="#f97316" delay={0.5} />
                    <StatCard icon={CheckCircle2} title="완료된 결제" value={`${(stats.completedPaymentCount || 0).toLocaleString()}건`} color="#06b6d4" delay={0.6} />
                    <StatCard icon={UserPlus} title="오늘 가입" value={`${stats.todayNewUsers || 0}명`} color="#ec4899" trend={-3} delay={0.7} />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Revenue Line Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">매출 추이</h3>
                                <p className="text-sm text-gray-500">최근 7일 일별 매출</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-[#635bff]/10 rounded-full">
                                <TrendingUp className="w-4 h-4 text-[#635bff]" />
                                <span className="text-sm font-semibold text-[#635bff]">+12%</span>
                            </div>
                        </div>
                        <Chart options={revenueLineOptions} series={revenueLineSeries} type="area" height={250} />
                    </motion.div>

                    {/* Goal Gauge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">월 목표</h3>
                                <p className="text-sm text-gray-500">1,000만원 목표</p>
                            </div>
                            <Target className="w-5 h-5 text-gray-400" />
                        </div>
                        <Chart options={goalGaugeOptions} series={[goalPercentage]} type="radialBar" height={220} />
                    </motion.div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Monthly Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">월별 매출</h3>
                        <p className="text-sm text-gray-500 mb-4">최근 6개월 비교</p>
                        <Chart options={monthlyBarOptions} series={monthlyBarSeries} type="bar" height={200} />
                    </motion.div>

                    {/* Party Status Donut */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">파티 현황</h3>
                        <p className="text-sm text-gray-500 mb-4">상태별 분포</p>
                        <Chart options={partyDonutOptions} series={partyDonutSeries} type="donut" height={200} />
                    </motion.div>

                    {/* User Growth Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">사용자 추이</h3>
                        <p className="text-sm text-gray-500 mb-4">주간 가입/활성</p>
                        <Chart options={userGrowthOptions} series={userGrowthSeries} type="area" height={200} />
                    </motion.div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* OTT Service Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">OTT별 파티</h3>
                        <p className="text-sm text-gray-500 mb-4">서비스별 현황</p>
                        <OttServiceStats stats={stats.ottPartyStats} />
                    </motion.div>

                    {/* Recent Users */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">최근 가입</h3>
                                <p className="text-sm text-gray-500">신규 회원</p>
                            </div>
                            <Link to="/admin/users" className="flex items-center gap-1 text-sm font-medium text-[#635bff] hover:underline">
                                전체보기 <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {stats.recentUsers?.slice(0, 4).map((user, index) => (
                                <motion.div
                                    key={user.odUserId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center text-white text-sm font-bold">
                                        {user.userName?.[0] || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 text-sm truncate">{user.userName}</div>
                                        <div className="text-xs text-gray-500 truncate">{user.userEmail}</div>
                                    </div>
                                    <div className="text-xs text-gray-400">{user.regDate?.slice(5)}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Payments */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">최근 결제</h3>
                                <p className="text-sm text-gray-500">결제 내역</p>
                            </div>
                            <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                            {stats.recentPayments?.slice(0, 4).map((payment, index) => (
                                <div key={payment.paymentId} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
                                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 text-sm truncate">{payment.odUserId}</div>
                                        <div className="text-xs text-gray-500">{payment.amount?.toLocaleString()}원</div>
                                    </div>
                                    <div className="text-xs text-gray-400">{payment.paymentDate?.slice(5)}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
