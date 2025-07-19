import { ZodType } from "zod";

export class Validation {
    static validate<T> (schema: ZodType, data: T): T | unknown {
        return schema.parse(data);
    }
}