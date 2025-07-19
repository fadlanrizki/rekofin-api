import { z, ZodType } from "zod";

export class authValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(1),
        fullname: z.string().min(1),
        email: z.string().email("This is not valid email"),
        password: z.string().min(8)
    })
}