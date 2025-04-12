'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PopularExpertItem from '@/components/molecules/popularExpertItem/PopularExpertItem';
import { ExpertCategory } from '@/constants/expert';
import SectionTitle from '@/components/atoms/texts/sectionTitle/SectionTitle';
import ExpertCategoryButtons from '@/components/molecules/HomePage/ExpertCategoryButtons';
import { getSortedExpertsByCategory, SortedExperts } from '@/apis/main/getPopularExpert';
import LoadingSpinner from '@/components/atoms/loadingSpinner/LoadingSpinner';
import ErrorState from '@/components/molecules/errorState/ErrorState';
import EmptyState from '@/components/molecules/emptyState/EmptyState';

function PopularExpertSection() {
  const [selectedCategory, setSelectedCategory] = useState<ExpertCategory>(ExpertCategory.ALL);

  const {
    data: expertsByCategory,
    isLoading,
    error,
    refetch,
  } = useQuery<SortedExperts>({
    queryKey: ['popularExperts'],
    queryFn: getSortedExpertsByCategory,
  });

  return (
    <section className="min-w-1280 flex flex-col gap-40">
      <div className="flex justify-between items-end">
        <SectionTitle
          title="지금 인기 있는 전문가"
          subtitle="돕당에서 인기 많은 전문가를 알아보세요."
        />
        <ExpertCategoryButtons
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </div>
      <div className="grid grid-cols-4 gap-24">
        {isLoading ? (
          <div className="col-span-4 py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="col-span-4">
            <ErrorState
              title="전문가 로딩 실패"
              message="인기 있는 전문가를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요."
              onRetry={() => refetch()}
            />
          </div>
        ) : expertsByCategory &&
          expertsByCategory[selectedCategory] &&
          expertsByCategory[selectedCategory].length > 0 ? (
          expertsByCategory[selectedCategory]
            .slice(0, 4)
            .map(item => <PopularExpertItem key={item.expertId} {...item} />)
        ) : (
          <div className="col-span-4">
            <EmptyState
              title="등록된 전문가가 없습니다"
              description="현재 등록된 전문가가 없습니다. 나중에 다시 확인해주세요."
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default PopularExpertSection;
