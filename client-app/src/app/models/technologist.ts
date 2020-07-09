export interface ITechnologist {
  id: string;
  name: string;
  initial: string;
  licenses: ITechnologistLicenses[];
}

export interface ITechnologistLicenses {
  licenseId: string;
  licenseDisplayName: string;
}

export interface ITechnologistForm {
  id: string;
  name: string;
  initial: string;
  modalityId: string;
  licenseIdList: string[];
}

export class TechnologistFormValues {
  id?: string = undefined;
  name: string = "";
  initial: string = "";
  modalityId: string = "";
}
