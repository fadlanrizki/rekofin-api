export type TAddFact = {
  code: string;
  description: string;
};

export type TEditFact = {
  id: number;
  code: string;
  description: string;
};

export type TGetListFact = {
  page: string;
  limit: string;
  search: string;
};
