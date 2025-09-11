import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../utils/env";

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1] || "";  

  if (!token) {
    res.status(403).json({
      ok: false,
      data: null,
      message: "Access Token Required",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      ok: false,
      data: null,
      message: "Invalid or expired token",
    });
  }
}
