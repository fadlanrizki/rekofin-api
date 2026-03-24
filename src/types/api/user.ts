import { Gender, Role } from "../../generated/prisma";

export type TCreateUser = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  gender: Gender;
};
