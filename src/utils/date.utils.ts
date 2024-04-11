export function getLastThreeMonths(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const lastMonth = month === 0 ? 11 : month - 1; // Adjust for January
  const lastYear = lastMonth === 11 ? year - 1 : year; // Adjust for December
  const lastMonthDays = new Date(lastYear, lastMonth + 1, 0).getDate(); // Number of days in last month

  let months = [];

  for (let i = 1; i <= 3; i++) {
    const m = month - i < 0 ? 12 + (month - i) : month - i;
    const y = m === 11 ? year - 1 : year;
    const days = m === month ? day : new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m, days);

    months.push({
      month: m + 1,
      year: y,
      days: days,
      firstDay: firstDay,
      lastDay: lastDay,
      inflow: 0,
      outflow: 0
    });
  }

  return months;
}
