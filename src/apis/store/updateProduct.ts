import { ProductType, DigitalContent } from '@/types/product';
import { categories } from '@/types/product';
import { APIBuilder } from '@/utils/APIBuilder';

// 상품 수정 요청 타입 정의
export interface UpdateProductRequest {
  categoryId: (typeof categories)[number]['category_id'];
  title: string;
  description: string;
  price: number;
  stock: number;
  productType: ProductType;
  thumbnailImage: string;
  digitalContents?: DigitalContent[];
}

// 상품 수정 응답 타입 정의
export interface UpdateProductResponse {
  message: string;
}

/**
 * 상품 수정 API 요청을 보내는 함수
 * @param productId - 수정할 상품 ID
 * @param productData - 수정할 상품 데이터
 * @returns 수정 성공 메시지
 */
export default async function updateProduct(
  productId: number,
  productData: UpdateProductRequest,
): Promise<UpdateProductResponse> {
  const response = await APIBuilder.patch(`/products/${productId}`, productData)
    .timeout(10000)
    .build()
    .call<UpdateProductResponse>();

  return response.data;
}
