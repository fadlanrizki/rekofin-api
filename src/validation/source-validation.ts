import { z, ZodType } from "zod";

export class SourceValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(255),
    author: z.string().min(1).max(255),
    publisher: z.string().max(255),
    sourceType: z.enum(["BOOK", "WEBSITE", "EXPERT", "JOURNAL", "OTHER"]),
    url: z.string().optional(),
    description: z.string().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    title: z.string().min(1).max(255).optional(),
    author: z.string().min(1).max(255).optional(),
    publisher: z.string().max(255).optional(),
    sourceType: z
      .enum(["BOOK", "WEBSITE", "EXPERT", "JOURNAL", "OTHER"])
      .optional(),
    url: z.string().optional(),
    description: z.string().optional(),
  });
}
