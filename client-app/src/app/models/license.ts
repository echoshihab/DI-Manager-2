export interface ILicense {
  id: string;
  name: string;
  displayName: string;
}

export interface ILicenseWithModality extends ILicense {
  modalityId: string;
}

export class LicenseFormValues {
  id?: string = undefined;
  name: string = "";
  displayName: string = "";
  modalityId: string = "";
}
