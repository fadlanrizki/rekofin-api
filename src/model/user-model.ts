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

export type LoginUserRequest = {
    username: string;
    password: string;
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
