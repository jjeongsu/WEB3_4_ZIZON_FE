import { APIBuilder } from '@/utils/APIBuilder';

// 제품 삭제 응답 타입 정의
export interface DeleteProductResponse {
  message: string;
}

/**
 * 제품 삭제 API 요청을 보내는 함수
 * @param productId - 삭제할 제품 ID
 * @returns 삭제 성공 메시지
 */
export default async function deleteProduct(productId: number): Promise<DeleteProductResponse> {
  const response = await APIBuilder.delete(`/products/${productId}`)
    .timeout(10000)
    .build()
    .call<DeleteProductResponse>();

  return response.data;
}
