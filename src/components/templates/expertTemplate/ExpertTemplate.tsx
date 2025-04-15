import { ExpertListResponseType } from '@/apis/expert/getExpertlist';
import Banner from '@/components/atoms/banner/Banner';
import ExpertList from '@/components/molecules/expert/expertList/ExpertList';
import ExpertListItem from '@/components/molecules/expert/expertListItem/ExpertListItem';
import SortButtons, { SortType } from '@/components/molecules/sortButtons/SortButtons';
import ExpertSidebar from '@/components/organisms/sidebar/ExpertSidebar/ExpertSidebar';
import { Suspense } from 'react';

export default function ExpertTemplate({ expertList }: { expertList: ExpertListResponseType }) {
  return (
    <div className="w-full h-fit mt-46 flex flex-col items-center mb-100">
      <Banner />
      {/* 사이드바 영역 */}
      <div className=" flex gap-24 mt-40 ">
        <Suspense>
          <ExpertSidebar />
        </Suspense>
        {/* 컨텐츠 영역 */}
        <div className="w-full flex flex-col gap-16">
          {/* <SortButtons /> */}

          <Suspense fallback={<div className="w-full h-100 bg-black1 animate-pulse">로딩중</div>}>
            <ExpertList>
              {expertList.map(expert => (
                <ExpertListItem expert={expert} key={expert.name} />
              ))}
            </ExpertList>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
