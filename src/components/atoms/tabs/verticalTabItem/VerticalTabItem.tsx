interface VerticalTabItemProps {
  name: string;
  isFocused: boolean;
  text: string;
  onClick: (name: string) => void;
  size: 'small' | 'large';
}

const sizeVariation = {
  large: 'w-217 text-16', // 큰거
  small: 'w-194 text-12', // 작은거
} as const;

export default function VerticalTabItem({
  name,
  isFocused,
  text,
  onClick,
  size,
}: VerticalTabItemProps) {
  const focusedTabStyle = isFocused
    ? 'bg-primary1 border-1 border-primary2 text-black12'
    : 'bg-black2 text-black6';
  return (
    <li
      onClick={() => onClick(name)}
      className={`list-none px-20 py-12 rounded-[8px] hover:bg-black3 font-semibold cursor-pointer transition-colors duration-200 ${focusedTabStyle} ${sizeVariation[size]}`}
    >
      {text}
    </li>
  );
}
