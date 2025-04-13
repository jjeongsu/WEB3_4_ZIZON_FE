'use client';

import getRooms, { GetRoomsResponse } from '@/apis/chat/getRooms';
import getOfferList from '@/apis/offer/getOffer';
import getProjectInClient from '@/apis/project/getProjectInClient';
import ExpertChattingInfo from '@/components/organisms/chatting/chattingInfo/expert/ExpertChattingInfo';
import ChattingRoom from '@/components/organisms/chatting/chattingRoom/ChattingRoom';
import { useUserData } from '@/hooks/useUserData';
import { useUserStore } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ChatRoomType } from './ChattingTemplate';
import ChattingLoadingSkeleton from './ChattingLoadingSkeleton';

export default function ExpertChattingTemplate() {
  const member = useUserStore(state => state.member);
  // 채팅방 목록 필터링 : 안읽음, 전체, 거래중
  const [roomFilter, setRoomFilter] = useState<ChatRoomType>('all');

  const [room, setRoom] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null); // 현제 선택된 프로젝트 Id
  const { expertInfo } = useUserData();
  const expertId = expertInfo?.id; // 현재 전문가(자기자신)의 id
  const service = expertInfo?.categoryName || '서비스'; // 전문가의 서비스 카테고리

  const {
    data: chatRoomList,
    isLoading,
    isLoading: isLoadingRooms,
  } = useQuery({
    queryKey: ['chatRoomList'],
    queryFn: () => getRooms({ memberEmail: member.email }),
  });

  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectInClient({ projectId: String(projectId) }),
    throwOnError: true,
    enabled: !!projectId,
  });

  const { data: offerData, isLoading: isLoadingOffer } = useQuery({
    queryKey: ['offer', projectId, expertId],
    queryFn: () => getOfferList({ projectId: projectId!, expertId: expertId! }),
    enabled: !!projectId,
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
        chatRoomList={filteredChatRoomList}
        handleFilterChange={handleFilterChange}
      />

      {/* // OFFER의 description이 옳지 않은 값으로 온경우 에러가 발생 */}
      <ExpertChattingInfo
        projectData={projectData}
        offerData={offerData}
        service={service}
        expertId={expertId}
      />
    </div>
  );
}
