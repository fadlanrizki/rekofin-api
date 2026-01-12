export type TAddFact = {
  code: string;
  description: string;
  question: string;
};

export type TEditFact = {
  id: number;
  code: string;
  description: string;
  question: string;
};

export type TGetListFact = {
  page: string;
  limit: string;
  search: string;
};
