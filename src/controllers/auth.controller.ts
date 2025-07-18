import { Request, Response, NextFunction } from "express";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  // next()
};

const login = async (req: Request, res: Response) => {};

export { register, login };
