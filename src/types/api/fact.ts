export type TAddFact = {
  code: string;
  description: string;
  question: string;
  isYesOrNoQuestion: boolean;
  fact: string;
};

export type TEditFact = {
  id: number;
  code: string;
  description: string;
  question: string;
  isYesOrNoQuestion: boolean;
  fact: string;
};
