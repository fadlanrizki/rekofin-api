export type TAddRule = {
  name: string;
  conditionFactIds: string[];
  result: string[];
};

export type TEditRule = {
  id: number;
  name: string;
  conditions: string[];
  conclusions: string[];
  isActive: true
};

export type TGetListRule = {
  page: string;
  limit: string;
  search: string;
};
