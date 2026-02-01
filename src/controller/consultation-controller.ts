import { Request, Response, NextFunction } from "express";
import { ConsultationService } from "../service/consultation-service";

export class ConsultationController {
  static async startConsultation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await ConsultationService.startConsultation(req);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Starting consultation process",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getConsultationQuestion(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await ConsultationService.getConsultationQuestions(req);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil mendapatkan data pertanyaan",
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitConsultationAnswer(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await ConsultationService.submitConsultationAnswer(req);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil submit data konsultasi",
      });
    } catch (error) {
      next(error);
    }
  }
  static async getConsultationResult(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await ConsultationService.getConsultationResult(req);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil mendapatkan hasil konsultasi",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getConsultationHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await ConsultationService.getConsultationHistory(req);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil mendapatkan hasil konsultasi",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserConsultationStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await ConsultationService.getUserConsultationStatus(req);
      res.status(200).json({
        ok: true,
        data: response,
        message: "Berhasil mendapatkan status konsultasi user",
      });
    } catch (error) {
      next(error);
    }
  }
}
