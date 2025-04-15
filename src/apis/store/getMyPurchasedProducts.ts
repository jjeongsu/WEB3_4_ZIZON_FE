import { APIBuilder } from '@/utils/APIBuilder';
import { PurchasedProductsResponseType } from '@/types/order';

interface GetMyPurchasedProductsRequestType {
  page?: number;
  size?: number;
}

export default async function getMyPurchasedProducts({
  page = 0,
  size = 10,
}: GetMyPurchasedProductsRequestType = {}): Promise<PurchasedProductsResponseType> {
  const params: Record<string, number> = {
    page,
    size,
  };

  try {
    console.log('API 요청 시작:', { page, size });

    const response = await APIBuilder.get('/users/my-purchased-products')
      .params(params)
      .timeout(10000)
      .build()
      .call<PurchasedProductsResponseType>();

    return response.data;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
}
