import Image from 'next/image';

interface StarDefaultProps {
  rating: number;
}

const StarDefault = ({ rating }: StarDefaultProps) => {
  return (
    <div className="flex items-center gap-2">
      <Image src={'/icons/StarOnLarge.svg'} alt="별점" width={20} height={16} />
      <div className="flex gap-2 items-end">
        <span className="inline-block text-16 mr-2 text-black7 font-medium">{rating}</span>
      </div>
    </div>
  );
};

export default StarDefault;
