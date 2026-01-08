export type TAddRule = {
  name: string;
  conditions: string[];
  result: string[];
};

export type TEditRule = {
  id: number;
  name: string;
  conditions: string[];
  result: string[];
};

export type TGetListRule = {
  page: string;
  limit: string;
  search: string;
};
