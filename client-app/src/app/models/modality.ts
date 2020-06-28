export interface IModality {
  id: string;
  name: string;
  displayName: string;
}

export class ModalityFormValues {
  id?: string = undefined;
  name: string = "";
  displayName: string = "";
}
