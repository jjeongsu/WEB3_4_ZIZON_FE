import { APIBuilder } from '@/utils/APIBuilder';

export default async function postChatRoomWithExpert(projectId: number, expertId: number) {
  const response = await APIBuilder.post(
    `/chatrooms/choose?projectId=${projectId}&expertId=${expertId}`,
    {},
  )
    .timeout(10000)
    .withCredentials(true)
    .build()
    .call();

  return response;
}
