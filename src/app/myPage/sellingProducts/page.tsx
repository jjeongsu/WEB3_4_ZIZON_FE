'use client';

import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/components/atoms/loadingSpinner/LoadingSpinner';
import ErrorState from '@/components/molecules/errorState/ErrorState';
import EmptyState from '@/components/molecules/emptyState/EmptyState';
import { useRouter, useSearchParams } from 'next/navigation';
import getMySellingProducts from '@/apis/store/getMySellingProducts';
import ProductCard from '@/components/molecules/productCard/ProductCard';
import Pagination from '@/components/molecules/pagination/Pagination';

export default function SellingProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 0;
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sellingProducts', currentPage],
    queryFn: () => getMySellingProducts({ page: currentPage, size: pageSize }),
  });

  const handlePageChange = (newPage: number) => {
    router.push(`/myPage/sellingProducts?page=${newPage}`);
  };

  if (isLoading) {
    return (
      <div className="w-full pt-24 pl-64">
        <h1 className="text-24 font-bold mb-40">판매중인 상품</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pt-24 pl-64">
        <h1 className="text-24 font-bold mb-40">판매중인 상품</h1>
        <ErrorState
          message="판매중인 상품을 불러오는 중 오류가 발생했습니다."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const products = data?.products || [];
  const hasNext = data?.hasNext || false;

  return (
    <div className="w-full pt-24 pl-64">
      <h1 className="text-24 font-bold mb-40">판매중인 상품</h1>

      {products.length === 0 ? (
        <EmptyState
          title="판매중인 상품이 없습니다"
          description="아직 등록한 상품이 없습니다. 상품을 등록해보세요!"
        />
      ) : (
        <>
          <div className="w-full grid grid-cols-3 gap-20">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination currentPage={currentPage} hasNext={hasNext} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
