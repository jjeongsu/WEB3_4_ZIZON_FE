'use client';
import { OfferResponseType } from '@/apis/offer/getOffer';
import { ProjectResponseType } from '@/apis/project/getProject';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';
import OfferInfo from '@/components/molecules/chat/OfferInfo';
import ProjectSummary from '@/components/organisms/projectSummary/ProjectSummary';
import { useUserStore } from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface ExpertChattingInfoProps {
  offerData: OfferResponseType | undefined;
  projectData: ProjectResponseType | undefined;
  service: string;
  expertId: number;
  roomId?: string | null;
}

export default function ExpertChattingInfo({
  offerData,
  projectData,
  service,
  expertId,
  roomId,
}: ExpertChattingInfoProps) {
  if (!projectData) {
    return (
      <div className="w-full max-w-402 flex flex-col gap-16 bg-black1 rounded-sm">
        <div className="w-full h-400 flex flex-col items-center justify-center">
          <p className="text-16 text-gray-500">채팅 목록에서 견적을 협상중인 </p> <br />
          <p className="text-16 text-gray-500">의뢰인을 선택해주세요.</p>
        </div>
      </div>
    );
  }
  const member = useUserStore(state => state.member);
  const currentUserEmail = member?.email || ''; // 현재 사용자의 이메일
  const router = useRouter();
  const projectId = projectData.id;
  const queryClient = useQueryClient();
  const handleChatOut = async () => {
    if (roomId) {
      const response = confirm('채팅방을 나가시겠습니까?');
      if (response) {
        try {
          const outResponse = await fetch(
            `${process.env.SERVER_URL}/chatrooms/${roomId}/leave?username=${currentUserEmail}`,
            {
              method: 'POST',
              headers: {
                accept: 'application/json',
              },
              credentials: 'include',
            },
          );

          if (!outResponse.ok) {
            throw new Error(`Error: ${outResponse.status}`);
          }

          const result = await outResponse.text();
          alert(result); // 서버에서 반환된 메시지 표시

          // ['chatroomList'] 쿼리 무효화 및 새로고침
          queryClient.invalidateQueries({ queryKey: ['chatRoomList'] });
        } catch (error) {
          console.error('채팅방 나가기 요청 실패:', error);
          alert('채팅방 나가기에 실패했습니다. 다시 시도해주세요.');
        }
      }
    }
  };
  return (
    <div className="w-full max-w-402 flex flex-col gap-16">
      <StandardButton
        text="채팅방 나가기"
        state="default"
        size="full"
        onClick={handleChatOut}
        disabled={false}
      />

      {/* 보낸 견적서 */}
      {offerData ? (
        <OfferInfo offerInfo={offerData} type="expert" service={service} expertId={expertId} />
      ) : (
        <StandardButton
          text="견적서 보내기"
          state="blue"
          size="full"
          onClick={() => {
            router.push(`/expert/make-offer?projectId=${projectId}&hasChat=${true}`);
          }}
          disabled={false}
        />
      )}

      {projectData && <ProjectSummary projectData={projectData} />}
    </div>
  );
}
