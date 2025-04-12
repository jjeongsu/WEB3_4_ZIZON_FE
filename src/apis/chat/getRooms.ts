'use client';

import { useUserStore } from '@/store/userStore';
import { APIBuilder } from '@/utils/APIBuilder';
import { createDropdownMenuScope } from '@radix-ui/react-dropdown-menu';

interface RoomType {
  roomId: string;
  sender: string;
  receiver: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  projectId: number;
  otherUserName: string;
  otherUserProfile: string;
  otherUserId: number;
  expertId: number;
}

export type GetRoomsResponse = RoomType[];
export default async function getRooms({
  memberEmail,
}: { memberEmail?: string } = {}): Promise<GetRoomsResponse> {
  const response = await APIBuilder.get(`/chatrooms/rooms?member=${memberEmail}`)
    .timeout(10000)
    .withCredentials(true)
    .build()
    .call<GetRoomsResponse>();

  return response.data;
}
