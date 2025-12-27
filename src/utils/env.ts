import dotenv from "dotenv";

dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const USER_SECRET_KEY: string = process.env.USER_SECRET_KEY || "";
export const ADMIN_SECRET_KEY: string = process.env.ADMIN_SECRET_KEY || "";
