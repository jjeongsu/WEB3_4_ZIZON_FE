'use client';

import SellStateTabItem from '@/components/atoms/tabs/sellStateTabItem/SellStateTabItem';
import { ContractStatus } from '@/types/contract';
import { ProjectStatus } from '@/types/project';

interface SellStateTabContainerProps {
  counts: {
    inProgress: number;
    cancelled: number;
    completed: number;
  };
  selectedState: ProjectStatus | ContractStatus | null;
  onStateSelect: (state: ProjectStatus | ContractStatus) => void;
  isExpertView?: boolean;
}

export default function SellStateTabContainer({
  counts,
  selectedState,
  onStateSelect,
  isExpertView = false,
}: SellStateTabContainerProps) {
  return (
    <div className="grid grid-cols-3 gap-x-16 gap-y-16 p-16 border border-black3 rounded-2xl mb-32">
      <SellStateTabItem
        state="IN_PROGRESS"
        count={counts.inProgress}
        isSelected={selectedState === 'IN_PROGRESS'}
        isExpertView={isExpertView}
        onClick={() => onStateSelect('IN_PROGRESS')}
      />
      <SellStateTabItem
        state="CANCELLED"
        count={counts.cancelled}
        isSelected={selectedState === 'CANCELLED'}
        isExpertView={isExpertView}
        onClick={() => onStateSelect('CANCELLED')}
      />
      <SellStateTabItem
        state="COMPLETED"
        count={counts.completed}
        isSelected={selectedState === 'COMPLETED'}
        isExpertView={isExpertView}
        onClick={() => onStateSelect('COMPLETED')}
      />
    </div>
  );
}
