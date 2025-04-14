export default function ChattingLoadingSkeleton() {
  return (
    <div className="flex gap-24 mt-46 items-start justify-center w-1670 animate-pulse">
      {/* 왼쪽 채팅방 리스트 스켈레톤 */}
      <div className="w-402 flex flex-col gap-20">
        {/* 필터 버튼 스켈레톤 */}
        <div className="flex gap-8">
          <div className="w-60 h-32 bg-gray-300 rounded-[16px]" />
          <div className="w-60 h-32 bg-gray-300 rounded-[16px]" />
          <div className="w-60 h-32 bg-gray-300 rounded-[16px]" />
        </div>

        {/* 검색창 스켈레톤 */}
        <div className="w-full h-40 bg-gray-300 rounded-full" />

        {/* 채팅방 리스트 스켈레톤 */}
        <div className="flex flex-col gap-16">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-80 bg-gray-300 rounded-[8px] flex items-center gap-8 px-16"
            >
              <div className="w-40 h-40 bg-gray-400 rounded-full" />
              <div className="flex flex-col gap-4 w-full">
                <div className="w-3/4 h-16 bg-gray-400 rounded" />
                <div className="w-1/2 h-12 bg-gray-400 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 채팅 화면 스켈레톤 */}
      <div className="w-full flex-col min-w-690 max-w-828">
        <div className="w-full h-745 bg-gray-300 rounded-[8px] mb-16" />

        {/* 입력창 스켈레톤 */}
        <div className="w-full flex flex-col gap-10">
          <div className="w-full h-40 bg-gray-300 rounded-full" />
          <div className="flex justify-between items-center">
            <div className="w-32 h-40 bg-gray-300 rounded-[8px]" />
            <div className="w-60 h-40 bg-gray-300 rounded-[8px]" />
          </div>
        </div>
      </div>

      {/* 오른쪽 정보 패널 스켈레톤 */}
      <div className="w-402 flex flex-col gap-16">
        <div className="w-full h-40 bg-gray-300 rounded-[8px]" />
        <div className="w-full h-300 bg-gray-300 rounded-[16px]" />
        <div className="w-full h-400 bg-gray-300 rounded-[8px]" />
      </div>
    </div>
  );
}
