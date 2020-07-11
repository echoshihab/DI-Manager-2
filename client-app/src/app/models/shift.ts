export interface IShift {
  id: string;
  start: Date;
  end: Date;
  licenseId: string;
  licenseDisplayName: string;
  locationId: string;
  locationName: string;
  roomId: string;
  roomName: string;
  technologistId: string;
  technologistInitial: string;
  modalityId: string;
}

export interface IShiftFormValues extends Partial<IShift> {
  date?: Date;
}

export class ShiftFormValues implements IShiftFormValues {
  id?: string = undefined;
  date?: Date = undefined;
  start?: Date = undefined;
  end?: Date = undefined;
  licenseId: string = "";
  locationId: string = "";
  roomId: string = "";
  technologistId: string = "";
  modalityId: string = "";

  constructor(init?: ShiftFormValues) {
    if (init && !init.date) {
      init.date = init.start;
    }
    Object.assign(this, init);
  }
}
