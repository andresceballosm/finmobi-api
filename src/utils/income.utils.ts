export const getIncomeMonthly = (value: number, frequency: string) => {
  switch (frequency) {
    case "MONTHLY":
      return value;
    case "QUARTERLY":
      return value / 3;
    case "BIANNUAL":
      return value / 6;
    default:
      return 0;
  }
};
