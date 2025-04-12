import getRooms, { GetRoomsResponse } from '@/apis/chat/getRooms';
import ExpertChattingTemplate from '@/components/templates/chatTemplate/ExpertChattingTemplate';

export default async function ExpertChatPage() {
  return (
    <div className="w-full flex justify-center">
      <ExpertChattingTemplate />
    </div>
  );
}
