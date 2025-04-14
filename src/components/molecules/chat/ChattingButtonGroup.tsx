'use client';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';
import { useState } from 'react';
import ModalContainer from '../modal/ModalContainer';
import ContractModal, { FormValue } from '../modal/ContractModal';
import { OfferResponseType } from '@/apis/offer/getOffer';
import { ExpertType } from '@/apis/expert/getExpert';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postContract, PostContractRequestType } from '@/apis/contract/postContract';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { APIBuilder } from '@/utils/APIBuilder';

export default function ChattingButtonGroup({
  offerInfo,
  expertInfo,
  roomId,
}: {
  offerInfo: OfferResponseType;
  expertInfo: ExpertType;
  roomId?: string | null;
}) {
  const member = useUserStore(state => state.member);
  const currentUserEmail = member?.email || ''; // 현재 사용자의 이메일
  const [openContract, setOpenContract] = useState(false);
  const router = useRouter();
  const postContractMutation = useMutation({
    mutationFn: (contractRequest: PostContractRequestType) => postContract(contractRequest),
    onError: error => console.error('계약서 제출 에러:', error),
    onSuccess: data => {
      alert('계약서 제출 성공');
      setOpenContract(false);
      const { contractId } = data;
      const paymentType = 'PROJECT';
      router.push(`/payments?id=${contractId}&type=${paymentType}`);
    },
  });
  postContractMutation.data;
  // 계약서 제출
  const handleSubmitContract = (formValue: FormValue) => {
    postContractMutation.mutate({
      offerId: offerInfo.id,
      price: formValue.servicePrice,
      startDate: formValue.serviceStartDate,
      endDate: formValue.serviceEndDate,
    });
  };
  const queryClient = useQueryClient();
  // 채팅방 나가기
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

  const contractInfo = {
    expertProfileImage: expertInfo.profileImage,
    expertName: expertInfo.name,
    expertCategory: expertInfo.categoryName,
    charge: offerInfo.price,
  };

  return (
    <div className="w-full flex gap-16">
      <StandardButton
        text="채팅방 나가기"
        onClick={handleChatOut}
        disabled={false}
        size="full"
        state="default"
      />
      <StandardButton
        text="거래하기"
        onClick={() => {
          setOpenContract(true);
        }}
        disabled={false}
        size="full"
        state="blue"
      />
      <ModalContainer open={openContract}>
        <ContractModal
          onClose={() => setOpenContract(false)}
          onSubmit={handleSubmitContract}
          offerData={contractInfo}
        />
      </ModalContainer>
    </div>
  );
}
