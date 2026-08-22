import { Router } from "express";
import { ConsultationController } from "../controller/consultation-controller";

const consultationRouter = Router();
consultationRouter.post("/", ConsultationController.startConsultation);
consultationRouter.get(
  "/:id/questions",
  ConsultationController.getConsultationQuestion,
);
consultationRouter.post(
  "/:id/answers",
  ConsultationController.submitConsultationAnswer,
);
consultationRouter.post(
  "/:id/comparison",
  ConsultationController.saveConsultationComparison,
);
consultationRouter.get(
  "/:id/result",
  ConsultationController.getConsultationResult,
);
consultationRouter.get(
  "/status",
  ConsultationController.getUserConsultationStatus,
);
consultationRouter.get(
  "/history",
  ConsultationController.getConsultationHistory,
);
consultationRouter.get(
  "/latest",
  ConsultationController.getLatestConsultationResult,
);

export default consultationRouter;
