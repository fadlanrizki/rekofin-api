import { Request, Response, NextFunction } from "express";
import { RecommendationService } from "../service/recommendation-service";
import {TAddRecommendation, TParamRecommendation} from "../model/recommendation-model";

export class RecommendationController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as unknown as TAddRecommendation;
            const response = await RecommendationService.create(request);
            res.status(200).json({
                ok: true,
                data: response,
                message: "Berhasil Menambahkan Rekomendasi",
            });
        } catch (error) {
            next(error);
        }
    }

    static async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.params as unknown as TParamRecommendation;
            const response = await RecommendationService.getList(request);
            res.status(200).json({
                ok: true,
                data: response,
                message: "Berhasil mendapatkan daftar Rekomendasi",
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const response = await RecommendationService.delete(id);
            res.status(200).json({
                ok: true,
                data: response,
                message: "Berhasil delete data Rekomendasi",
            });
        } catch (error) {
            next(error);
        }
    }

    static async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const response = await RecommendationService.findById(id);
            res.status(200).json({
                ok: true,
                data: response,
                message: `Berhasil mendapatkan data rekomendasi`,
            });
        } catch (error) {
            next(error);
        }
    }
}
