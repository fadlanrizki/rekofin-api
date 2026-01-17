export type TAddRule = {
  name: string;
  description: string;
  conditions: number[];
  conclusions: number[];
};

export type TEditRule = {
  id: number;
  name: string;
  description: string;
  conditions: number[];
  conclusions: number[];
  isActive: boolean;
};

export type TGetListRule = {
  page: string;
  limit: string;
  search: string;
};
