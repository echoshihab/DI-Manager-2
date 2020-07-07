export interface ITechnologist {
  id: string;
  name: string;
  initial: string;
  licenses: ITechnologistLicenses[] | string[];
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
  licenseIdList: string[] = [];
}
