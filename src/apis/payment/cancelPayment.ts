import { APIBuilder } from '@/utils/APIBuilder';

export interface CancelPaymentRequest {
  orderId: string;
  cancelReason: string;
  cancelAmount?: number; // 부분 취소 시에만 사용
}

export interface CancelPaymentResponse {
  paymentId: number;
  paymentKey: string;
  status: 'PARTIALLY_CANCELED' | 'FULLY_CANCELED';
  canceledAmount: number;
  remainingAmount: number;
  message: string;
  canceledAt: string;
}

/**
 * 결제를 취소합니다.
 * @param data 결제 취소 요청 데이터
 * @returns 결제 취소 응답
 */
export const cancelPayment = async (data: CancelPaymentRequest): Promise<CancelPaymentResponse> => {
  try {
    const response = await APIBuilder.post('/payments/cancel', data)
      .timeout(10000)
      .build()
      .call<CancelPaymentResponse>();

    return response.data;
  } catch (error) {
    console.error('결제 취소 실패:', error);
    throw error;
  }
};
