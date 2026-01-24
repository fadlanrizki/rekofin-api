type weeklyChartType = {
  label: string;
  value: number;
};

export const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
export function getCurrentWeekRange() {
  const now = new Date();

  const day = now.getDay(); // 0=Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
}

export const listWeeklyChart = (): weeklyChartType[] => {
  return DAYS.map((day) => ({
    label: day,
    value: 0,
  }));
};

export const getCountOfWeeklyDataChart = (list: Date[]) => {
  const listWeek = [...listWeeklyChart()];

  list.forEach((item) => {
    const dayIndex = item.getDay() === 0 ? 6 : item.getDay() - 1;

    listWeek[dayIndex].value += 1;
  });

  return listWeek;
};
