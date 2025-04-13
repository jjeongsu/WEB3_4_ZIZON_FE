'use client';
import { OfferResponseType } from '@/apis/offer/getOffer';
import { ProjectResponseType } from '@/apis/project/getProject';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';
import OfferInfo from '@/components/molecules/chat/OfferInfo';
import ProjectSummary from '@/components/organisms/projectSummary/ProjectSummary';
import { useRouter } from 'next/navigation';

interface ExpertChattingInfoProps {
  offerData: OfferResponseType | undefined;
  projectData: ProjectResponseType | undefined;
  service: string;
  expertId: number;
}

export default function ExpertChattingInfo({
  offerData,
  projectData,
  service,
  expertId,
}: ExpertChattingInfoProps) {
  if (!projectData) {
    return <div>채팅방을 선택하세요</div>;
  }

  const router = useRouter();
  const projectId = projectData.id;
  return (
    <div className="w-full max-w-402 flex flex-col gap-16">
      <StandardButton
        text="채팅방 나가기"
        state="default"
        size="full"
        onClick={() => {}}
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
