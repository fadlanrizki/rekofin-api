export type TAddRecommendation = {
  categoryId: number;
  message: string;
  source: string;
};

export type TEditRecommendation = {
  id: number;
  categoryId: number;
  message: string;
  source: string;
};

export type TGetListRecommendation = {
  page: string;
  limit: string;
  search: string;
};
