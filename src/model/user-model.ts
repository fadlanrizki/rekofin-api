import { Role, User } from "../generated/prisma";

export type UserResponse = {
  username: string;
  fullName: string;
  token?: string;
  role?: string;
};

export type CreateUserRequest = {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role?: string;
};

export type AddUserRequest = {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
}
export type UpdateUserRequest = {
  id: number;
  fullName: string;
  password: string;
}

export type AddUserResponse = {
  id?: string;
  fullName: string;
}

export type UpdateUserResponse = {
  id: number;
  fullName: string
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

type UserListItem = {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export type getUsersResponse = {
  list: UserListItem[]
}

export function getRoleUser() {
  return Role.user;
}

export function getRoleAdmin() {
  return Role.admin;
}

export function toUserModel(user: User): UserResponse {
  return {
    fullName: user.fullName,
    username: user.username
  };
}
