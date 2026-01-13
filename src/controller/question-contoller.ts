import { Request, Response, NextFunction } from "express";
import { QuestionService } from "../service/question-service";
import { TAddQuestion, TGetListQuestion } from "../types/api/question";

export class QuestionController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as unknown as TAddQuestion;
      const response = await QuestionService.create(request);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil Menambahkan question",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req?.query as unknown as TGetListQuestion;

      const response = await QuestionService.getList(request);
      res.status(200).json({
        ok: true,
        ...response,
        message: "Berhasil Get List question",
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.id;
      const data = await QuestionService.findById(id);
      res.status(200).json({
        ok: true,
        data,
        message: `Berhasil Get data question`,
      });
    } catch (error) {
      next(error);
    }
  }
}
