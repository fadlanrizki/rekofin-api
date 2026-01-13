export type TAddQuestion = {
  factCode: string;
  text: string;
};

export type TEditQuestion = {
  id: number;
  factCode: string;
  text: string;
};

export type TGetListQuestion = {
  page: string;
  limit: string;
  search: string;
};
