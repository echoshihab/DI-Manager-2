export interface ITechnologist {
  id: string;
  name: string;
  initial: string;
  licenseIdList: ITechnologistLicenses[] | string[]; //possibly need to change the name to licenses.
}

export interface ITechnologistLicenses {
  licenseId: string;
  licenseDisplayName: string;
}

export class TechnologistFormValues {
  id?: string = undefined;
  name: string = "";
  initial: string = "";
  modalityId: string = "";
}
