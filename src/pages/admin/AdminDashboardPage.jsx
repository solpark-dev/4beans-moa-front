import React from "react";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, DollarSign, Users, PartyPopper, TrendingUp } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminDashboardPage() {
    const { stats, loading, error } = useAdminDashboard();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)] text-red-500 font-bold">
                통계 데이터를 불러오는데 실패했습니다.
            </div>
        );
    }

    // --- 차트 데이터 구성 ---

    // 1. 매출 현황 (예시: 아직 월별 데이터가 없으므로 단일 데이터로 표시하거나 더미 데이터 활용 고려)
    // 여기서는 현재 총 매출을 시각적으로 보여주기 위해 간단한 Bar Chart 사용
    const revenueData = {
        labels: ["총 매출"],
        datasets: [
            {
                label: "매출액 (원)",
                data: [stats.totalRevenue],
                backgroundColor: "rgba(99, 102, 241, 0.5)", // Indigo-500
                borderColor: "rgb(79, 70, 229)", // Indigo-600
                borderWidth: 1,
            },
        ],
    };

    const revenueOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "누적 매출 현황",
            },
        },
    };

    // 2. 파티 현황 (Doughnut Chart)
    // 활성 파티 vs (전체 - 활성) = 종료/대기 파티
    const inactiveParties = stats.totalPartyCount - stats.activePartyCount;

    const partyData = {
        labels: ["활성 파티", "기타 파티(대기/종료)"],
        datasets: [
            {
                label: "# of Parties",
                data: [stats.activePartyCount, inactiveParties],
                backgroundColor: [
                    "rgba(34, 197, 94, 0.5)", // Green-500
                    "rgba(203, 213, 225, 0.5)", // Slate-300
                ],
                borderColor: [
                    "rgb(22, 163, 74)",
                    "rgb(148, 163, 184)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    관리자 대시보드
                </h1>
                <p className="text-slate-500 mt-2">
                    서비스의 주요 지표와 현황을 한눈에 확인하세요.
                </p>
            </div>

            {/* 요약 카드 섹션 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">총 매출</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalRevenue.toLocaleString()}원
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">활성 파티</CardTitle>
                        <PartyPopper className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                            {stats.activePartyCount}개
                        </div>
                        <p className="text-xs text-muted-foreground">
                            현재 진행 중인 파티
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">전체 파티</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPartyCount}개</div>
                        <p className="text-xs text-muted-foreground">누적 파티 개수</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">총 회원</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.totalUserCount}명
                        </div>
                        <p className="text-xs text-muted-foreground">누적 가입 회원</p>
                    </CardContent>
                </Card>
            </div>

            {/* 차트 섹션 */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle>매출 현황</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Bar options={revenueOptions} data={revenueData} />
                    </CardContent>
                </Card>

                <Card className="p-6">
                    <CardHeader>
                        <CardTitle>파티 상태 비율</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex justify-center">
                        <Doughnut data={partyData} options={{ maintainAspectRatio: false }} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
