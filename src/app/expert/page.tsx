import { ExpertListRequestType, getExpertlist } from '@/apis/expert/getExpertlist';
import ExpertTemplate from '@/components/templates/expertTemplate/ExpertTemplate';
import { PROJECT_CATEGORY, ProjectCategoryIdType } from '@/constants/category';

export default async function ExpertPage({
  searchParams,
}: {
  searchParams: Promise<{
    category: ProjectCategoryIdType;
    career: string;
    search: string;
  }>;
}) {
  const { category, career, search } = await searchParams;

  const RequestQuery: ExpertListRequestType = {
    careerLevel: career?.toUpperCase() || null,
    categoryNames: PROJECT_CATEGORY[category as ProjectCategoryIdType] || null,
    search: search ? search : undefined,
  };

  const data = await getExpertlist(RequestQuery);
  console.log('전문가 목록', data);
  return <ExpertTemplate expertList={data} />;
}
