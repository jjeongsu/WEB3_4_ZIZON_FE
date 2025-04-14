import { APIBuilder } from '@/utils/APIBuilder';

export interface DeleteUserResponseType {
  message: string;
}

export const deleteUser = async (userId: number): Promise<DeleteUserResponseType> => {
  const response = await APIBuilder.delete(`/users/${userId}`)
    .timeout(10000)
    .build()
    .call<DeleteUserResponseType>();

  return response.data;
};
