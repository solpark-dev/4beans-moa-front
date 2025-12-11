export function FindIdForm({ onPassAuth, isLoading }) {
  return (
    <div className="border rounded-xl p-8 bg-gray-50">
      <p className="text-gray-700 mb-8 text-center leading-relaxed">
        PASS 버튼을 눌러 본인 인증을 진행해 주세요.
        <br />
        인증이 완료되면 이메일이 자동으로 표시됩니다.
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={onPassAuth}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 rounded-xl text-lg font-bold cursor-pointer shadow-md transition disabled:opacity-50"
        >
          {isLoading ? "처리중..." : "PASS"}
        </button>
      </div>
    </div>
  );
}
