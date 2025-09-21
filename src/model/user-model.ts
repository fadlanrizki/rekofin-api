import { Role } from "../generated/prisma";

export type TUser = {
  id: number;
  email: string;
  password: string;
  role?: string;
  fullName: string;
  username: string;
  occupation?: string;
  gender?: string | null;
};

export type TRegisterUser = Omit<
  TUser,
  "id" | "role" | "occupation" | "gender"
>;

export type TCreateUser = Omit<TUser, "id" | "password">;

export type TUpdateUser = Partial<TCreateUser>;

export type FilterUser = {
  role: "all" | "admin" | "employee";
};

export type TParamUser = {
  search: string;
  filter: FilterUser;
  limit: string;
  page: string;
};

export type TLoginUser = {
  credential: string;
  password: string;
};

export function getRoleUser() {
  return Role.user;
}

export function getRoleAdmin() {
  return Role.admin;
}
