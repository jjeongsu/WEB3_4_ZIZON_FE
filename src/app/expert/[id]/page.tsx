import { getExpert } from '@/apis/expert/getExpert';
import { getExpertReviews } from '@/apis/review/getExpertReviews';
import ExpertInfoCard from '@/components/molecules/expert/expertInfoCard/ExpertInfoCard';
import RequestOfferBox from '@/components/molecules/expertDetail/requestOfferBox/RequestOfferBox';
import ExpertIntroduction from '@/components/organisms/expertDetail/expertIntroduction/ExpertIntroduction';
import ExpertProfile from '@/components/organisms/expertDetail/expertProfile/ExpertProfile';
import ExpertDetailTemplate from '@/components/templates/expertDetailTemplate/ExpertDetailTemplate';

export default async function ExpertIdPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  //여기서 전문가 정보 호출
  const { id: expertId } = params;
  const data = await getExpert({ expertId });
  const reviewResponse = await getExpertReviews(expertId);
  const reviewData = reviewResponse.reviews;
  return (
    <div className="mt-78 flex justify-center">
      <ExpertDetailTemplate
        ExpertProfileComponent={
          <ExpertProfile
            ExpertInfoCardComponent={
              <ExpertInfoCard
                infoArray={[
                  { content: data.name, title: '이름' },
                  { content: `${data.categoryName}`, title: '직업' },
                  { content: `${data.careerYears}년`, title: '경력' },
                ]}
                type="large"
              />
            }
            categoryName={data.categoryName}
            introduction={data.introduction}
            name={data.name}
            profileImageUrl={data.profileImage}
          />
        }
        ExpertIntroductionComponent={
          <ExpertIntroduction
            ReviewList={reviewData}
            portfolioImage={data.portfolioImage}
            career_years={data.careerYears}
            certification={data.certificateNames}
            introduction={data.introduction}
            major_category={data.categoryName}
            sub_category_names={data.subCategoryNames}
          />
        }
        RequestOfferBoxComponent={
          <RequestOfferBox
            expertId={data.id.toString()}
            name={data.name}
            mainCategoryId={data.mainCategoryId}
          />
        }
      />
    </div>
  );
}
