export const combineDateAndTime = (date: Date, time: Date) => {
  const dateString = date.toDateString();
  const timeString = time.toTimeString();

  return new Date(dateString + " " + timeString);
};

//
//filter strings
export const filterDate: string = "filterDate";
export const filterTechnologist: string = "filterTechnologist";
export const filterLicense: string = "filterLicense";
export const filterLocation: string = "filterLocation";
export const monthFlag: string = "monthFlag";
