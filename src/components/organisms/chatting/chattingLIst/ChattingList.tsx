'use client';

import { GetRoomsResponse } from '@/apis/chat/getRooms';
import SearchBar from '@/components/atoms/inputs/searchBar/SearchBar';
import SmallTag from '@/components/atoms/tags/smallTag/SmallTag';
import ChatListItem from '@/components/molecules/chatListItem/ChatListItem';
import { CHATTING_STATE, ChattingStateType } from '@/constants/chat';

import { useState } from 'react';

interface ChattingListProps {
  chatRoomList: GetRoomsResponse;
  handleRoomChange: (roomId: string, projectId: number, expertId: number, receiver: string) => void;
  room: string | null; // 선택된 채팅방 id
  handleFilterChange?: (filter: string) => void; // 필터 변경 핸들러
}

export default function ChattingList({
  chatRoomList,
  handleRoomChange,
  room,
  handleFilterChange,
}: ChattingListProps) {
  const [filter, setFilter] = useState<ChattingStateType>(CHATTING_STATE[0].state);
  const [search, setSearch] = useState<string>('');

  const filteredChatRoomList = chatRoomList.filter(
    room => room.otherUserName?.includes(search) || room.lastMessage?.includes(search),
  );
  return (
    <div className="w-402 flex flex-col gap-20 justify-end">
      {/* 필터 태그 */}
      <div className="flex gap-8">
        {CHATTING_STATE.map(item => (
          <div
            onClick={() => {
              handleFilterChange(item.state);
              setFilter(item.state);
            }}
            key={item.state}
          >
            <SmallTag text={item.name} theme={filter === item.state ? 'dark' : 'default'} />
          </div>
        ))}
      </div>

      {/* 서치바 */}
      <SearchBar
        type="rounded"
        placeholder="검색어를 입력해주세요"
        value={search}
        onChange={(value: string) => setSearch(value)}
      />

      {/* 채팅 목록 */}
      <div className="flex flex-col rounded-[8px] border-1 border-black4 overflow-x-hidden max-h-830 overfllow-y-scroll">
        {filteredChatRoomList.map((item, index) => (
          <ChatListItem
            key={index}
            chatRoomId={item.roomId}
            recentChatDate={new Date(item.lastMessageTime)}
            text={item.lastMessage}
            userName={item.otherUserName}
            userProfile={item.otherUserProfile}
            isSelected={room === item.roomId}
            onClick={() =>
              handleRoomChange(item.roomId, item.projectId, item.expertId, item.receiver)
            }
            unreadCount={item.unreadCount}
          />
        ))}
      </div>
    </div>
  );
}
