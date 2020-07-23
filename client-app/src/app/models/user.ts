export interface IUser {
  userName: string;
  displayName: string;
  token: string;
  modalityId?: string;
  role: string;
}

export interface IUserFormValues {
  email: string;
  password: string;
  displayName?: string;
  userName?: string;
}
