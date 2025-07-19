import { User } from "../generated/prisma";

export type UserResponse = {
    username: string;
    fullName: string
    token?: string;
}

export type CreateUserRequest = {
    username: string;
    fullName: string;
    email: string;
    password: string;
}

export function toUserModel(user: User): UserResponse {
    return {
        fullName: user.fullName,
        username: user.username   
    }
}