export type TAddCategoryRequest = {
  name: string;
  description: string;
};

export type TEditCategoryRequest = {
  id: number;
  name: string;
  description: string;
};

export type TGetListCategoryRequest = {
  page: string;
  limit: string;
  search: string;
};
