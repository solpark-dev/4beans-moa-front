import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPartyList } from "../../services/partyService";


export default function PartyListPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchPartyList().then(setList);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">파티 찾기</h2>
          <Link
            to="/party/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            + 파티 만들기
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>현재 모집 중인 파티가 없습니다.</p>
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
                        : "text-gray-500"
                        }`}
                    >
                      {item.partyStatus}
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
                      <p className="text-gray-500 text-sm">모집 인원</p>
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
