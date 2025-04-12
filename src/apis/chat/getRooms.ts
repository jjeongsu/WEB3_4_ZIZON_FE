import { APIBuilder } from '@/utils/APIBuilder';
import { decodeToken } from '@/utils/decodeToken';
import { cookies } from 'next/headers';

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
export default async function getRooms() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    throw new Error('AccessToken이 없습니다.');
  }

  const email = decodeToken(token)?.username;
  const response = await APIBuilder.get(`/chatrooms/rooms?member=${email}`)
    .headers({
      Cookie: `accessToken=${token}`,
    })
    .withCredentials(true)
    .build()
    .call<GetRoomsResponse>();

  return response.data;
}
