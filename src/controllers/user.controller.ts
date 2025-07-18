import { Request, Response } from "express";
import { prismaClient } from "../application/database";

export const getUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany();
  res.json(users);
};
