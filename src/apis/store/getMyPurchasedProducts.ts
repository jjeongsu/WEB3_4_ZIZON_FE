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

  const response = await APIBuilder.get('users/my-purchased-products')
    .params(params)
    .timeout(10000)
    .build()
    .call<PurchasedProductsResponseType>();

  return response.data;
}
