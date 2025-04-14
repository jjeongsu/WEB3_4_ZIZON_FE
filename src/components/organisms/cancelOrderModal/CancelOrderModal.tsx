'use client';

import { useState } from 'react';
import ModalContainer from '@/components/molecules/modal/ModalContainer';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
}: CancelOrderModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalContainer open={isOpen}>
      <div className="bg-white px-40 py-36 rounded-2xl shadow-lg w-360">
        <h3 className="text-24 font-semibold text-center mb-16">주문 취소</h3>
        <p className="text-16 font-regular text-center mb-32 leading-[140%] whitespace-pre-line">
          {`${productName} 주문을 취소하시겠습니까?\n취소된 주문은 복구할 수 없습니다.`}
        </p>
        <div className="flex flex-col gap-12">
          <StandardButton
            text="취소하기"
            state="red"
            size="full"
            onClick={handleConfirm}
            disabled={isLoading}
          />
          <StandardButton
            text="돌아가기"
            state="default"
            size="full"
            onClick={onClose}
            disabled={isLoading}
          />
        </div>
      </div>
    </ModalContainer>
  );
}
