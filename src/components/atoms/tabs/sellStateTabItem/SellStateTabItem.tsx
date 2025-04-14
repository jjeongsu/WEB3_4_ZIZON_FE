'use client';

import Image from 'next/image';
import ProgressBlue from 'public/icons/ProgressBlue.svg';
import ProblemRed from 'public/icons/ProblemRed.svg';
import { ProjectStatus } from '@/types/project';
import { ContractStatus } from '@/types/contract';

interface SellStateTabItemProps {
  state: ProjectStatus | ContractStatus;
  count: number;
  isSelected?: boolean;
  isExpertView?: boolean;
  onClick?: () => void;
}

const stateConfig = {
  OPEN: {
    icon: null,
    label: '공고중',
    hasBorder: false,
  },
  PENDING: {
    icon: null,
    label: '대기중',
    hasBorder: false,
  },
  IN_PROGRESS: {
    icon: ProgressBlue,
    label: '진행중',
    hasBorder: false,
  },
  CANCELLED: {
    icon: ProblemRed,
    label: '주문 취소',
    hasBorder: false,
  },
  COMPLETED: {
    icon: null,
    label: '구매 확정',
    expertLabel: '거래 완료',
    hasBorder: true,
  },
  DISPUTED: {
    icon: null,
    label: '분쟁중',
    hasBorder: false,
  },
} as const;

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function SellStateTabItem({
  state,
  count,
  isSelected = false,
  isExpertView = false,
  onClick,
}: SellStateTabItemProps) {
  const config = stateConfig[state as keyof typeof stateConfig];
  const formattedCount = formatNumber(count);
  const label = isExpertView && 'expertLabel' in config ? config.expertLabel : config.label;

  return (
    <div
      className={`h-full flex items-center justify-between bg-black1 shadow-style2 py-16 px-20 rounded-lg border border-black2 ${
        config.hasBorder ? 'border-black4' : ''
      } ${isSelected ? 'border-primary4' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-12">
        {config.icon && (
          <>
            <Image src={config.icon} alt="" width={30} height={30} />
            <label
              className={`text-16 font-medium text-black10  ${isSelected ? 'text-primary' : ''}`}
            >
              {label}
            </label>
          </>
        )}
        {!config.icon && (
          <label
            className={`text-16 font-medium text-black10  ${isSelected ? 'text-primary' : ''}`}
          >
            {label}
          </label>
        )}
      </div>
      <label className={`text-20 text-right font-semiBold ${isSelected ? 'text-primary' : ''}`}>
        {formattedCount}
      </label>
    </div>
  );
}
