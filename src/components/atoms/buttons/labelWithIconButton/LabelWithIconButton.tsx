'use client';

import React from 'react';
import Image from 'next/image';
import { ExpertCategory } from '@/types/expert';

export type ProductCategory = 'digital' | 'living';
export type ButtonState = 'default' | 'active';

interface LabelWithIconButtonProps {
  onClick: () => void;
  value: ExpertCategory | ProductCategory;
  state: ButtonState;
  name: string;
}

const BUTTON_CONFIG = {
  move: {
    icon: '/icons/MoveTruck.svg',
    label: '이사/청소',
  },
  fix: {
    icon: '/icons/FixWrench.svg',
    label: '설치/수리',
  },
  tutor: {
    icon: '/icons/LessonHat.svg',
    label: '과외',
  },
  hobby: {
    icon: '/icons/HobbyPalette.svg',
    label: '취미생활',
  },
  digital: {
    icon: '/images/DigitalLaptop.png',
    label: 'IT/Digital',
  },
  living: {
    icon: '/images/LivingHouse.png',
    label: '리빙',
  },
} as const;

const BASE_BUTTON_CLASSES =
  'flex text-center min-w-full items-center px-24 py-28 rounded-lg text-16 font-medium text-black12 transition-all duration-300';
const STATE_CLASSES = {
  default: 'bg-black2 hover:bg-black3',
  active: 'bg-primary0',
};

export default function LabelWithIconButton({
  onClick,
  value,
  state,
  name,
}: LabelWithIconButtonProps) {
  const { icon, label } = BUTTON_CONFIG[value];
  const buttonClasses = `${BASE_BUTTON_CLASSES} ${STATE_CLASSES[state]}`;

  return (
    <label className={buttonClasses}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={state === 'active'}
        onChange={onClick}
        className="hidden"
      />
      <div className="flex items-center gap-20">
        <Image src={icon} alt={label} width={30} height={30} />
        <p>{label}</p>
      </div>
    </label>
  );
}
