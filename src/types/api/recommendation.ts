export type TAddRecommendation = {
  conclusionId: number;
  title: string;
  content: string;
  sourceId: number;
};

export type TEditRecommendation = {
  id: number;
  conclusionId: number;
  title: string;
  content: string;
  sourceId: number;
};
