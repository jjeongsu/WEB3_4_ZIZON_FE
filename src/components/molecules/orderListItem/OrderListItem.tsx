'use client';

import React, { useState } from 'react';
import NumberReadability from '@/components/atoms/texts/numberReadability/NumberReadability';
import Image from 'next/image';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';
import { sellStateConfig } from '@/types/sellState';
import { Project, ProjectStatus } from '@/types/project';
import { Contract, ContractStatus } from '@/types/contract';
import ReviewModal from '@/components/organisms/reviewModal/ReviewModal';
import CancelOrderModal from '@/components/organisms/cancelOrderModal/CancelOrderModal';
import { createReview } from '@/apis/review/createReview';
import { cancelPayment } from '@/apis/payment/cancelPayment';
import { toast } from 'sonner';
import { ApiError } from '@/types/api';

type OrderItemType = Project | Contract;

interface OrderListItemProps {
  item: OrderItemType;
  onClickAskButton: () => void;
  isExpertView?: boolean;
  paymentOrderId?: string;
}

interface ButtonStyle {
  text: string;
  state: 'default' | 'dark' | 'red';
}

const buttonStyle: Record<ProjectStatus | ContractStatus, ButtonStyle> = {
  PENDING: {
    text: '문의하기',
    state: 'default',
  },
  DISPUTED: {
    text: '문의하기',
    state: 'default',
  },
  OPEN: {
    text: '문의하기',
    state: 'default',
  },
  IN_PROGRESS: {
    text: '문의하기',
    state: 'default',
  },
  COMPLETED: {
    text: '리뷰작성',
    state: 'dark',
  },
  CANCELLED: {
    text: '취소하기',
    state: 'red',
  },
} as const;

export default function OrderListItem({
  item,
  onClickAskButton,
  isExpertView = false,
  paymentOrderId,
}: OrderListItemProps) {
  const [imagePath, setImagePath] = useState(
    'thumbnailImageUrl' in item ? item.thumbnailImageUrl : '/images/defaultImage.png',
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const stateConfig = sellStateConfig[item.status];
  const buttonConfig = isExpertView
    ? { text: '문의하기', state: 'default' as const }
    : buttonStyle[item.status];

  const handleButtonClick = () => {
    if (item.status === 'COMPLETED' && !isExpertView) {
      setIsReviewModalOpen(true);
    } else if (item.status === 'CANCELLED' && !isExpertView) {
      setIsCancelModalOpen(true);
    } else {
      onClickAskButton();
    }
  };

  const handleReviewSubmit = async (review: { rating: number; content: string }) => {
    try {
      const id = 'id' in item ? item.id : item.contractId;
      if (!id) {
        toast.error('프로젝트 ID가 없습니다.');
        return;
      }

      await createReview({
        projectId: id,
        score: review.rating,
        content: review.content,
        imageUrl: imagePath,
      });

      toast.success('리뷰가 성공적으로 등록되었습니다.');
      setIsReviewModalOpen(false);
    } catch (error: unknown) {
      // ApiError 인스턴스인 경우 처리
      if (error instanceof ApiError) {
        const status = error.status || 500;
        const message = error.message || '알 수 없는 오류가 발생했습니다.';

        switch (status) {
          case 400:
            toast.error(`데이터 형식 오류: ${message}`);
            break;
          case 401:
            toast.error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
            break;
          case 403:
            toast.error('리뷰를 작성할 권한이 없습니다.');
            break;
          case 409:
            toast.error('이미 리뷰가 작성된 계약입니다.');
            break;
          default:
            toast.error(`리뷰 등록에 실패했습니다: ${message}`);
        }
      } else {
        // 일반 에러 처리
        toast.error('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
      }
      console.error('리뷰 제출 실패:', error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      if (!paymentOrderId) {
        toast.error('결제 정보가 없습니다.');
        return;
      }

      const response = await cancelPayment({
        orderId: paymentOrderId,
        cancelReason: '고객 요청에 의한 취소',
      });

      toast.success(response.message);
      setIsCancelModalOpen(false);
    } catch (error: unknown) {
      // ApiError 인스턴스인 경우 처리
      if (error instanceof ApiError) {
        const status = error.status || 500;
        const message = error.message || '알 수 없는 오류가 발생했습니다.';

        switch (status) {
          case 400:
            toast.error(`데이터 형식 오류: ${message}`);
            break;
          case 401:
            toast.error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
            break;
          case 403:
            toast.error('주문을 취소할 권한이 없습니다.');
            break;
          case 409:
            toast.error('이미 취소된 주문입니다.');
            break;
          default:
            toast.error(`주문 취소에 실패했습니다: ${message}`);
        }
      } else {
        // 일반 에러 처리
        toast.error('주문 취소에 실패했습니다. 다시 시도해주세요.');
      }
      console.error('주문 취소 실패:', error);
    }
  };

  const title = 'title' in item ? item.title : item.projectTitle;
  const price = 'budget' in item ? item.budget : item.price;

  return (
    <>
      <article className="flex bg-black1 border border-black3 p-20 rounded-xl items-center justify-between">
        <div className="flex items-center gap-16">
          <div className="w-85 h-85 rounded-lg overflow-hidden">
            <Image
              className={`size-full object-cover ${item.status === 'COMPLETED' && 'saturate-0'}`}
              src={imagePath === '' ? '/images/DefaultImage.png' : imagePath}
              alt={title}
              width={85}
              height={85}
              onError={() => setImagePath('/public/images/DefaultImage.png')}
            />
          </div>
          <div className="flex flex-col gap-12">
            <label className={`text-16 font-semibold ${stateConfig.textColor}`}>
              {stateConfig.label}
            </label>
            <div className="flex flex-col gap-8">
              <span className="text-16 font-regular">{title}</span>
              <p className="text-16 font-semibold">
                <NumberReadability value={price} />원
              </p>
            </div>
          </div>
        </div>
        <StandardButton
          text={buttonConfig.text}
          state={buttonConfig.state}
          size="fit"
          onClick={handleButtonClick}
          disabled={false}
        />
      </article>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        productName={title}
      />
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        productName={title}
      />
    </>
  );
}
