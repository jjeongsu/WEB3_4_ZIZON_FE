import Image from 'next/image';
import { getTimeAgo } from '@/utils/dateFormat';
import StarDefault from '@/components/atoms/texts/starDefault/StarDefault';
import { ExpertReview } from '@/apis/review/getExpertReviews';

function ReviewItem({
  reviewId,
  score,
  content,
  imageUrl,
  reviewerName,
  reviewerProfileImage,
  createAt,
}: ExpertReview) {
  return (
    <article className="w-628 flex flex-col">
      <div className="flex flex-col mb-12">
        <div className="flex gap-16 mb-12">
          <Image
            src={reviewerProfileImage || '/images/DefaultImage.png'}
            alt="profile"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-8 mb-4">
              <span className="text-13 font-medium text-black6">{reviewerName}</span>
              <StarDefault rating={score} />
            </div>
          </div>
        </div>
        <p className="text-16 font-regular text-black7 leading-[140%]">{content}</p>
      </div>
      <span className="text-13 font-regular text-black6">{getTimeAgo(new Date(createAt))}</span>
    </article>
  );
}

export default ReviewItem;
