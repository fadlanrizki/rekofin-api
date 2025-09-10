import { z, ZodType } from "zod";

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(1),
    fullName: z.string().min(1),
    email: z.email("This is not valid email"),
    password: z.string().min(1),
  });

  static readonly LOGIN: ZodType = z.object({
    credential: z.string().min(1),
    password: z.string().min(1),
  });
}
