export interface IUser {
  userName: string;
  displayName: string;
  token: string;
  refreshToken: string;
  modalityId?: string;
  role: string;
}

export interface IUserSlim {
  userName: string;
  modalityId: string | null;
  role: string;
}

export interface IUserFormValues {
  email: string;
  password: string;
  displayName?: string;
  userName?: string;
}
