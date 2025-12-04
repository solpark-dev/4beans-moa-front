import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyParties } from "../../api/partyApi";

export default function MyPartyListPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMyParties();
    }, []);

    const loadMyParties = async () => {
        try {
            const data = await getMyParties();
            setList(data);
        } catch (error) {
            console.error("Failed to load my parties", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12 w-full">
                <h2 className="text-3xl font-bold mb-8">내 파티 목록</h2>

                {list.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-500 mb-4">가입한 파티가 없습니다.</p>
                        <Link
                            to="/party/list"
                            className="text-blue-600 font-bold hover:underline"
                        >
                            파티 찾아보기
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {list.map((item) => (
                            <Link
                                key={item.partyId}
                                to={`/party/${item.partyId}`}
                                className="block bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded">
                                            {item.productName}
                                        </span>
                                        <span
                                            className={`text-sm font-semibold ${item.partyStatus === "RECRUITING"
                                                    ? "text-green-600"
                                                    : item.partyStatus === "ACTIVE"
                                                        ? "text-blue-600"
                                                        : "text-gray-500"
                                                }`}
                                        >
                                            {item.partyStatus === "RECRUITING"
                                                ? "모집중"
                                                : item.partyStatus === "ACTIVE"
                                                    ? "진행중"
                                                    : item.partyStatus}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 truncate">
                                        {item.productName} 파티
                                    </h3>
                                    <div className="flex justify-between items-end mt-6">
                                        <div>
                                            <p className="text-gray-500 text-sm">월 구독료</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {item.monthlyFee?.toLocaleString()}원
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-500 text-sm">멤버</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                {item.currentMembers} / {item.maxMembers}명
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
