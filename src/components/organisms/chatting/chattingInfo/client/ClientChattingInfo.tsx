'use client';
import { ExpertType, getExpert } from '@/apis/expert/getExpert';
import { OfferResponseType } from '@/apis/offer/getOffer';
import ChattingButtonGroup from '@/components/molecules/chat/ChattingButtonGroup';
import ChattingExpertInfo from '@/components/molecules/chat/ChattingExpertInfo';
import OfferInfo from '@/components/molecules/chat/OfferInfo';

interface ClientChattingInfoProps {
  expertData: ExpertType | undefined;
  offerData: OfferResponseType | undefined;
  expertId: number | null;
  roomId?: string | null;
}

export default function ClientChattingInfo({
  expertData,
  offerData,
  expertId,
  roomId,
}: ClientChattingInfoProps) {
  if (!expertId) {
    return (
      <div className="w-full max-w-402 flex flex-col gap-16 bg-black1 rounded-sm">
        <div className="w-full h-400 flex flex-col items-center justify-center">
          <p className="text-16 text-gray-500">채팅 목록에서 견적을 협상중인 </p> <br />
          <p className="text-16 text-gray-500">전문가를 선택해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-402 flex flex-col gap-16">
      <ChattingButtonGroup offerInfo={offerData} expertInfo={expertData} roomId={roomId} />

      {offerData && expertData && (
        <OfferInfo
          offerInfo={offerData}
          type="client"
          service={expertData.categoryName}
          expertId={expertId}
        />
      )}
      {expertData && <ChattingExpertInfo expertData={expertData} />}
    </div>
  );
}
