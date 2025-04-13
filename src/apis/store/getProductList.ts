import { clsx } from 'clsx';
import { APIBuilder } from '@/utils/APIBuilder';

export interface ProductListRequestType {
  categoryId: string;
  page: number;
  keyword?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productType: string;
  thumbnailUrl: string;
  expertName: string;
  categoryName: string;
  createdAt: string;
}

type ProductListResponseType = {
  products: Array<Product>;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
};

export default async function getProductList({
  categoryId,
  page,
  keyword,
}: ProductListRequestType): Promise<ProductListResponseType> {
  // URLSearchParams를 사용하여 동적으로 쿼리 생성
  const params = new URLSearchParams();

  // 필수 파라미터 추가
  params.append('page', page.toString());
  params.append('size', '12');
  params.append('categoryId', categoryId);

  // 선택적 파라미터 추가
  if (keyword) {
    params.append('keyword', keyword);
  }
  const response = await APIBuilder.get(`/products?${params.toString()}`)
    .timeout(10000)
    .withCredentials(true)
    .build()
    .call<ProductListResponseType>();
  //console.log('상품목록', response.data);
  return response.data;
}
