import StandardButton from '@/components/atoms/buttons/standardButton/StandardButton';

interface PaginationProps {
  currentPage: number;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, hasNext, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      <StandardButton
        text="이전"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        state="blue-outline"
      />
      <span className="py-2 px-4">{currentPage + 1}</span>
      <StandardButton
        text="다음"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        state="blue-outline"
      />
    </div>
  );
}
