import { UserValidation } from './../validation/user-validation';
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { getRoleUser, TCreateUser, TRegisterUser } from "../model/user-model";
import { Validation } from "../validation/validation";

export class UserService {

  static async create(request: TCreateUser): Promise<any> {
      const registerRequest = Validation.validate(
        UserValidation.CREATE,
        request
      ) as unknown as TRegisterUser;
  
      const selectCountUser = await prismaClient.user.count({
        where: {
          username: registerRequest.username,
        },
      });
  
      const selectCountUserEmail = await prismaClient.user.count({
        where: {
          email: registerRequest.email,
        },
      });
  
      if (selectCountUser != 0) {
        throw new ResponseError(400, "Username already exist");
      }
  
      if (selectCountUserEmail != 0) {
        throw new ResponseError(400, "Email already exist");
      }
  
      return await prismaClient.user.create({
        data: {
          ...registerRequest,
          role: getRoleUser(),
        },
        select: {
          fullName: true,
          username: true,
        },
      });
    }

}