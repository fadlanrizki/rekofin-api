export interface JwtPayloadBase {
  id: number;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
}
