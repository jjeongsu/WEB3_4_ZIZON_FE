'use client';

import React, { useState } from 'react';
import NumberReadability from '@/components/atoms/texts/numberReadability/NumberReadability';
import Image from 'next/image';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';
import { sellStateConfig } from '@/types/sellState';
import { ContractStatus } from '@/types/contract';
import { ProjectStatus } from '@/types/project';
import ReviewModal from '@/components/organisms/reviewModal/ReviewModal';
import CancelOrderModal from '@/components/organisms/cancelOrderModal/CancelOrderModal';
import { createReview } from '@/apis/review/createReview';
import { cancelPayment } from '@/apis/payment/cancelPayment';
import { toast } from 'sonner';

export interface OrderListItemProps {
  imageUrl: string;
  price: number;
  sellState: ProjectStatus | ContractStatus;
  onClickAskButton: () => void;
  category: string;
  isExpertView?: boolean;
  orderId?: number;
  expertId?: number;
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
  imageUrl,
  price,
  sellState,
  onClickAskButton,
  category,
  isExpertView = false,
  orderId,
  expertId,
  paymentOrderId,
}: OrderListItemProps) {
  const [imagePath, setImagePath] = useState(imageUrl);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const stateConfig = sellStateConfig[sellState];
  const buttonConfig = isExpertView
    ? { text: '문의하기', state: 'default' as const }
    : buttonStyle[sellState];

  const handleButtonClick = () => {
    if (sellState === 'COMPLETED' && !isExpertView) {
      setIsReviewModalOpen(true);
    } else if (sellState === 'CANCELLED' && !isExpertView) {
      setIsCancelModalOpen(true);
    } else {
      onClickAskButton();
    }
  };

  const handleReviewSubmit = async (review: { rating: number; content: string }) => {
    try {
      if (!orderId || !expertId) {
        toast.error('주문 ID 또는 전문가 ID가 없습니다.');
        return;
      }

      await createReview({
        review_type: 'product',
        contract_id: null,
        order_id: orderId,
        expert_id: expertId,
        rating: review.rating,
        content: review.content,
      });

      toast.success('리뷰가 성공적으로 등록되었습니다.');
      setIsReviewModalOpen(false);
    } catch (error) {
      toast.error('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
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
    } catch (error) {
      toast.error('주문 취소에 실패했습니다. 다시 시도해주세요.');
      console.error('주문 취소 실패:', error);
    }
  };

  return (
    <>
      <article className="flex bg-black1 border border-black3 p-20 rounded-xl items-center justify-between">
        <div className="flex items-center gap-16">
          <div className="w-85 h-85 rounded-lg overflow-hidden">
            <Image
              className={`size-full object-cover ${sellState === 'COMPLETED' && 'saturate-0'}`}
              src={imagePath === '' ? '/images/DefaultImage.png' : imagePath}
              alt={category}
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
              <span className="text-16 font-regular">{category}</span>
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
        productName={category}
      />
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        productName={category}
      />
    </>
  );
}
