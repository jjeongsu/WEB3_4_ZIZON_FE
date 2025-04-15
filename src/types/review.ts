export interface Review {
  reviewId: number;
  score: number; // 1부터 (0.5 단위로)
  content: string;
  summary: string;
  imageUrl: string;
  expertName: string;
  expertProfileImage: string;
  createdAt: string;
}
