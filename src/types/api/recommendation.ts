export type TAddRecommendation = {
  conclusionCode: string;
  text: string;
  principle?: string;
  source: string;
};

export type TEditRecommendation = {
  id: number;
  conclusionCode: string;
  text: string;
  principle?: string;
  source: string;
};
