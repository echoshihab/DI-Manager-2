export const getDaysInMonth = (): number => {
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  return new Date(currentYear, currentMonth + 1, 0).getDate();
};
