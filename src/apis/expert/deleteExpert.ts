import { APIBuilder } from '@/utils/APIBuilder';

export interface DeleteExpertResponseType {
  message: string;
}

export const deleteExpert = async (expertId: number): Promise<DeleteExpertResponseType> => {
  const response = await APIBuilder.delete(`/experts/${expertId}`)
    .timeout(10000)
    .build()
    .call<DeleteExpertResponseType>();

  return response.data;
};
