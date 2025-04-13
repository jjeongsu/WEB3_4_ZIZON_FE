'use client';

import getRooms, { GetRoomsResponse } from '@/apis/chat/getRooms';
import { getExpert } from '@/apis/expert/getExpert';
import getOfferList from '@/apis/offer/getOffer';
import ClientChattingInfo from '@/components/organisms/chatting/chattingInfo/client/ClientChattingInfo';
import ChattingRoom from '@/components/organisms/chatting/chattingRoom/ChattingRoom';
import { CHATTING_STATE } from '@/constants/chat';
import { useUserStore } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ChattingLoadingSkeleton from './ChattingLoadingSkeleton';
export type ChatRoomType = 'all' | 'unread' | 'waiting';

export default function ChattingTemplate() {
  const member = useUserStore(state => state.member);
  // 채팅방 목록 필터링 : 안읽음, 전체, 거래중
  const [roomFilter, setRoomFilter] = useState<ChatRoomType>('all');
  const [room, setRoom] = useState<string | null>(null); // roomId

  const [projectId, setProjectId] = useState<number | null>(null); // 현제 선택된 프로젝트 Id
  const [expertId, setExpertId] = useState<number | null>(null); // 현제 선택된 전문가 Id

  const {
    data: chatRoomList,
    isLoading,
    isLoading: isLoadingRooms,
  } = useQuery({
    queryKey: ['chatRoomList'],
    queryFn: () => getRooms({ memberEmail: member.email }),
  });

  const { data: expertData, isLoading: isLoadingExpert } = useQuery({
    queryKey: ['expert', expertId],
    queryFn: () => getExpert({ expertId: String(expertId) }),
    // queryFn: () => getExpert({ expertId: String(11) }),
    enabled: !!expertId,
  });

  const { data: offerData, isLoading: isLoadingOffer } = useQuery({
    queryKey: ['offer', projectId, expertId],
    queryFn: () => getOfferList({ projectId: projectId, expertId: expertId! }),
    // queryFn: () => getOfferList({ projectId: 235, expertId: 11 }),
    enabled: !!projectId && !!expertId,
  });

  const handleFilterChange = (filter: ChatRoomType) => {
    setRoomFilter(filter);
  };

  // roomFilter에 따라 채팅방 리스트 필터링
  const filteredChatRoomList = chatRoomList?.filter(room => {
    if (roomFilter === 'all') return true; // 전체
    if (roomFilter === 'unread') return room.unreadCount > 0; // 안 읽은 메시지가 있는 방
    if (roomFilter === 'waiting') return room.projectId !== null; // 거래 중인 방
    return true;
  });

  if (isLoadingRooms) {
    return <ChattingLoadingSkeleton />;
  }
  return (
    <div className="flex gap-24 mt-46 items-start jusitfy-center w-1670">
      <ChattingRoom
        roomId={room}
        setRoom={setRoom}
        setProjectId={setProjectId}
        setExpertId={setExpertId}
        chatRoomList={filteredChatRoomList}
        handleFilterChange={handleFilterChange}
      />

      <ClientChattingInfo expertData={expertData} offerData={offerData} expertId={expertId} />
    </div>
  );
}
