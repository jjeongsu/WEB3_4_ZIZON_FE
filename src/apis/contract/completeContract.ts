import { APIBuilder } from '@/utils/APIBuilder';

/**
 * 계약 완료 처리 API
 * 클라이언트가 자신의 프로젝트에 해당하는 계약을 완료 상태로 변경합니다.
 *
 * @param contractId - 완료 처리할 계약 ID
 * @returns Promise<void> - 성공 시 void 반환
 *
 * @throws {Error} 400 - 잘못된 요청
 * @throws {Error} 401 - 접근 권한이 없음
 * @throws {Error} 404 - 계약을 찾을 수 없음
 */

interface CompleteContractResponse {
  contractId: number;
  message: string;
}

export const completeContract = async (contractId: number): Promise<CompleteContractResponse> => {
  const response = await APIBuilder.patch(`/contracts/${contractId}/complete`, {})
    .headers({
      'Content-Type': 'application/json',
    })
    .timeout(10000)
    .build()
    .call<CompleteContractResponse>();

  return response.data;
};
