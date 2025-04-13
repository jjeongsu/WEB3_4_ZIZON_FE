'use client';

import { useState } from 'react';
import ModalContainer from '@/components/molecules/modal/ModalContainer';
import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; content: string }) => void;
  productName: string;
}

export default function ReviewModal({ isOpen, onClose, onSubmit, productName }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    onSubmit({ rating, content });
    setRating(5);
    setContent('');
  };

  return (
    <ModalContainer open={isOpen}>
      <div className="bg-white px-40 py-36 rounded-2xl shadow-lg w-340">
        <h3 className="text-24 font-semibold text-center mb-16">{productName} 리뷰 작성</h3>
        <div className="mb-24">
          <div className="flex items-center justify-center gap-8 mb-16">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-32 focus:outline-none"
              >
                {star <= rating ? '★' : '☆'}
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="리뷰를 작성해주세요"
            className="w-full h-120 p-16 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={500}
          />
        </div>
        <div className="flex flex-col gap-12">
          <StandardButton
            text="리뷰 등록"
            state="blue"
            size="full"
            onClick={handleSubmit}
            disabled={!content.trim()}
          />
          <StandardButton
            text="취소"
            state="default"
            size="full"
            onClick={onClose}
            disabled={false}
          />
        </div>
      </div>
    </ModalContainer>
  );
}
