import { format, getDaysInMonth } from "date-fns";

export const getMonthDates = (): { [key: string]: [] } => {
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let monthDates: { [key: string]: [] } = {};
  let day = 1;
  let daysInMonth = getDaysInMonth(currentDate);

  while (day <= daysInMonth) {
    monthDates[
      format(new Date(currentYear, currentMonth, day), "MM/dd/yyyy")
    ] = [];
    day++;
  }
  return monthDates;
};
