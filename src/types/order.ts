import { DigitalContent } from './product';

export interface Order {
  id: number;
  orderId: string;
  sellerName: string;
  productType: 'PHYSICAL' | 'DIGITAL';
  productThumbnail: string;
  productTitle: string;
  productPrice: string | number;
  quantity: string | number;
  totalPrice: number;
  status: 'PAID' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  orderedAt: string;
  digitalContent: DigitalContent[];
}

export interface PurchasedProductsResponseType {
  orders: Order[];
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
}
