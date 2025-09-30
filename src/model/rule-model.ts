export type TRule = {
  id: number
  name: string
  conditions: string
  categoryResult: string | "menabung" | "dana_darurat" | "investasi"
  description: string
  active: boolean
  createdAt: string
}

export type TAddRule = Omit<TRule, "id" | "createdAt">

export type FilterRule = {
  categoryResult: "all" | "menabung" | "dana_darurat" | "investasi"
};

export type TParamRule = {
  search: string;
  filter: FilterRule;
  limit: string;
  page: string;
};
