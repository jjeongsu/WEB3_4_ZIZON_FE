import { APIBuilder } from '@/utils/APIBuilder';
import { MySellingProductsResponseType } from '@/types/product';

interface GetMySellingProductsRequestType {
  page?: number;
  size?: number;
}

export default async function getMySellingProducts({
  page = 0,
  size = 10,
}: GetMySellingProductsRequestType = {}): Promise<MySellingProductsResponseType> {
  const params: Record<string, number> = {
    page,
    size,
  };

  const response = await APIBuilder.get('users/my-selling-products')
    .params(params)
    .timeout(10000)
    .build()
    .call<MySellingProductsResponseType>();

  return response.data;
}
