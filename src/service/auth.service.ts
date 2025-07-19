import { ResponseError } from "../error/response-error";
import { CreateUserRequest, UserResponse } from "../model/user-model";
import { authValidation } from "../validation/auth-validation";
import { Validation } from "../validation/validation";

export class AuthService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(authValidation.REGISTER, request)


        // kalo ada error
        // throw new ResponseError(400, "Username Already Exist")

        return new Promise(()=>{})
    }
}