export interface JwtPayloadBase {
  id: number;
  username: string;
  email: string;
  type: "USER" | "ADMIN";
}
