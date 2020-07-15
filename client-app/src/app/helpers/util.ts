export const combineDateAndTime = (date: Date, time: Date) => {
  const dateString = date.toDateString();
  const timeString = time.toTimeString();

  return new Date(dateString + " " + timeString);
};
