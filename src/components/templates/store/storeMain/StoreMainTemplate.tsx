'use client';

import getProductList, { Product } from '@/apis/store/getProductList';
import StoreMainContent from '@/components/organisms/store/StoreMainContent';
import StoreSearchRegister from '@/components/organisms/store/StoreSearchResgister';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

// page로 부터 받을 데이터  : 상품 목록
export default function StoreMainTemplate({ searchKeyword }: { searchKeyword: string }) {
  let initialCategory = '5001';
  if (searchKeyword === '분재') {
    initialCategory = '6004';
  } else if (searchKeyword === '가구') {
    initialCategory = '6001';
  } else if (searchKeyword === '악보') {
    initialCategory = '5002';
  }
  const [category, setCategory] = useState<string>(initialCategory); // 현재 선택된 카테고리
  const [data, setData] = useState<Product[] | null>(null); // 현재 상품 목록
  const [page, setPage] = useState<number>(0); // 현재 페이지
  const [hasNext, setHasNext] = useState<boolean>(false); // 다음 페이지 유무
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMore = useRef<HTMLDivElement | null>(null);

  useEffect(() => {}, []);

  // 초기 상품 목록 패칭
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const { products: productListData, hasNext } = await getProductList({
          page: 0,
          categoryId: category,
          keyword: searchKeyword,
        });
        const filteredData = productListData.filter(
          product => product.stock > 0 || product.stock === -1,
        );

        setData(filteredData);
        setHasNext(hasNext);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [category, searchKeyword]);

  // 더 많은 데이터 패칭
  const loadMoreData = async () => {
    if (isLoading) return; // 로딩 중이면 무시
    if (!hasNext) return; // 다음 페이지가 없으면 무시
    setIsLoading(true);
    try {
      const { products: productListData, hasNext } = await getProductList({
        page: page + 1,
        categoryId: category,
      });
      const filteredData = productListData.filter(
        product => product.stock > 0 || product.stock === -1,
      );
      setData(prevData => (prevData ? [...prevData, ...filteredData] : filteredData));
      setPage(prevPage => prevPage + 1);
      setHasNext(hasNext);
    } catch (error) {
      console.error('Error fetching more data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading) {
        if (!hasNext) return;
        await loadMoreData();
      }
    },
    [isLoading, data],
  );

  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '20px',
    });
    if (loadMore.current) {
      observer.current.observe(loadMore.current);
    }
    return () => {
      if (observer.current && loadMore.current) {
        observer.current.unobserve(loadMore.current);
      }
    };
  }, [handleObserver, loadMore]);

  return (
    <div className="w-full max-w-1280 mb-200 mt-72">
      <h1 className="font-semibold text-32 text-black12 mb-40">스토어</h1>
      <div className="w-full flex flex-col gap-32">
        <Suspense>
          <StoreSearchRegister searchKeyword={searchKeyword} />
        </Suspense>

        <StoreMainContent
          productList={data}
          category={category}
          onTabClick={category => setCategory(category)}
        />
      </div>
      <div ref={loadMore} className="h-30 bg-transparent"></div>
    </div>
  );
}
