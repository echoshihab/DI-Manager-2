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

export interface ITechnologistEdit {
  id: string;
  name: string;
  initial: string;
  licenseIdList: string[];
}

export interface ITechnologistForm extends ITechnologistEdit {
  modalityId: string;
}

export class TechnologistFormValues {
  id?: string = undefined;
  name: string = "";
  initial: string = "";
  modalityId: string = "";
}
