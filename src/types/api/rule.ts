export type TAddRule = {
  name: string;
  description: string;
  priority?: number;
  conditions: number[];
  conclusions: number[];
};

export type TEditRule = {
  id: number;
  name: string;
  description: string;
  priority?: number;
  conditions: number[];
  conclusions: number[];
};
