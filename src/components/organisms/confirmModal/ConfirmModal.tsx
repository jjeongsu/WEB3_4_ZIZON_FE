'use client';

import { ReactNode } from 'react';
import ModalContainer from '@/components/molecules/modal/ModalContainer';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  return (
    <ModalContainer open={isOpen}>
      <div className="bg-black1 px-40 py-36 rounded-2xl shadow-lg w-360">
        <h3 className="text-24 font-semibold text-center mb-16">{title}</h3>
        <p className="text-16 font-regular text-center mb-32 leading-[140%] whitespace-pre-line">
          {message}
        </p>
        {children}
        <div className="flex flex-col gap-12">
          <StandardButton
            text={confirmText}
            state="blue"
            size="full"
            onClick={onConfirm}
            disabled={false}
          />
          <StandardButton
            text={cancelText}
            state="default"
            size="full"
            onClick={onCancel}
            disabled={false}
          />
        </div>
      </div>
    </ModalContainer>
  );
}
