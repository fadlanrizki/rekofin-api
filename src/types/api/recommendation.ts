export type TAddRecommendation = {
  conclusionId: number;
  title: string;
  content: string;
  source: string;
};

export type TEditRecommendation = {
  id: number;
  conclusionId: number;
  title: string;
  content: string;
  source: string;
};
