import { Gender, Role } from "../../generated/prisma";

export type TCreateUser = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  gender: Gender;
};

export type TUpdateProfile = {
  fullname?: string;
  username?: string;
  email?: string;
  gender?: Gender
  occupation?: string;
};

export type TChangePassword = {
  password: string;
  old_password: string;
};
