import { DAYS } from "../date";

export const formatDataChart = (data: any[], label: string, value: string) => {
  return data.map((item) => ({
    label: item[label],
    value: item[value],
  }));
};


