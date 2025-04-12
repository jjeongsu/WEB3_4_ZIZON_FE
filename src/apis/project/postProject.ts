import { APIBuilder } from '@/utils/APIBuilder';

interface PostProjectRequest {
  categoryId: number;
  title: string;
  summary: string;
  description: string;
  region: string;
  budget: number;
  deadline: string;
  expertId?: number | null;
  imageUrls?: string[] | null;
}
interface PostProjectResponse {
  projectId: number;
  message: string;
}
export const postProject = async ({
  categoryId,
  title,
  summary,
  description,
  region,
  budget,
  deadline,
  expertId,
  imageUrls,
}: PostProjectRequest) => {
  const bodyForm = {
    categoryId,
    title,
    summary,
    description,
    region,
    budget,
    deadline,
    expertId,
  };
  console.log('bodyForm', bodyForm);
  const response = await APIBuilder.post('/projects', { ...bodyForm })
    .headers({
      'Content-Type': 'application/json',
    })
    .timeout(10000)
    .withCredentials(true)
    .build()
    .call<PostProjectResponse>();

  return response.data;
};
