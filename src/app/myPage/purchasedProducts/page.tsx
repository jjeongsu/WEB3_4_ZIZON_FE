'use client';

import { useQuery } from '@tanstack/react-query';
import OrderCard from '@/components/organisms/orderCard/OrderCard';
import getMyPurchasedProducts from '@/apis/store/getMyPurchasedProducts';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/atoms/loadingSpinner/LoadingSpinner';
import ErrorState from '@/components/molecules/errorState/ErrorState';
import EmptyState from '@/components/molecules/emptyState/EmptyState';
import Pagination from '@/components/molecules/pagination/Pagination';

export default function PurchasedProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 0;
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['purchasedProducts', currentPage],
    queryFn: () => getMyPurchasedProducts({ page: currentPage, size: pageSize }),
  });

  const handlePageChange = (newPage: number) => {
    router.push(`/myPage/purchasedProducts?page=${newPage}`);
  };

  if (isLoading) {
    return (
      <div className="w-full pt-24 pl-64">
        <h1 className="text-24 font-bold mb-40">구매한 상품</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pt-24 pl-64">
        <h1 className="text-24 font-bold mb-40">구매한 상품</h1>
        <ErrorState
          message="구매 내역을 불러오는 중 오류가 발생했습니다."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const orders = data?.orders || [];
  const hasNext = data?.hasNext || false;

  return (
    <div className="w-full pt-24 pl-64">
      <h1 className="text-24 font-bold mb-40">구매한 상품</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="구매한 상품이 없습니다"
          description="아직 구매한 상품이 없습니다. 상품을 구매해보세요!"
        />
      ) : (
        <>
          <div className="w-full flex flex-col gap-20">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          <Pagination currentPage={currentPage} hasNext={hasNext} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
