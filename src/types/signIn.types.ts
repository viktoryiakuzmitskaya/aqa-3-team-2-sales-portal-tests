import { IResponseFields } from './api.types';

export interface ICredentials {
  email: string;
  password: string;
}

export interface IAPICredentials {
  username: string;
  password: string;
}
export interface IManager {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdOn: string;
}

export interface ILoginFromResponse extends IResponseFields {
  User: IManager;
}
