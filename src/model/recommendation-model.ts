export type TRecommendation = {
  id: number;
  category: "menabung" | "dana_darurat" | "investasi";
  content: string;
  sourceType: "book" | "educational" | "influencer";
  sourceName: string;
  author: string;
  title: string;
};

export type TAddRecommendation = Omit<TRecommendation, "id">;
export type TUpdateRecommendation = Partial<TAddRecommendation>;

type FilterRecommendation = {
  category: "all" | "menabung" | "dana_darurat" | "investasi";
  sourceType: "all" | "book" | "educational" | "influencer";
};

export type TParamRecommendation = {
  search: string;
  filter: FilterRecommendation;
  limit: string;
  page: string;
};
