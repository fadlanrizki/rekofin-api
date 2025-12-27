import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { USER_SECRET_KEY, ADMIN_SECRET_KEY } from "../utils/env";
import { JwtPayloadBase } from "../types/jwt";

export interface UserRequest extends Request {
  user?: JwtPayloadBase;
}
export interface AdminRequest extends Request {
  admin?: JwtPayloadBase;
}

export const userAuth = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "User token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      USER_SECRET_KEY as string
    ) as JwtPayloadBase;

    if (decoded.type !== "USER") {
      res.status(403).json({ message: "Invalid user token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "User token invalid or expired" });
  }
};

export const adminAuth = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers?.authorization || "";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Admin token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      ADMIN_SECRET_KEY as string
    ) as JwtPayloadBase;

    if (decoded.type !== "ADMIN") {
      res.status(403).json({ message: "Invalid admin token" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Admin token invalid or expired" });
  }
};
