import z, { ZodType } from "zod";

export class UserValidation {
  
  static readonly CREATE: ZodType = z.object({
    username: z.string().min(1),
    fullName: z.string().min(1),
    email: z.string().email("This is not valid email"),
    password: z.string().min(1),
    role: z.string().min(1),
    
  });

  static readonly UPDATE: ZodType = z.object({
    fullName: z.string().min(1),
    password: z.string().min(1),
  });
}
