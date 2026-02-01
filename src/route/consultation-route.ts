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
consultationRouter.get(
  "/:id/result",
  ConsultationController.getConsultationResult,
);
consultationRouter.get(
  "/status",
  ConsultationController.getUserConsultationStatus,
);

// get consultation history
consultationRouter.get("/", ConsultationController.getConsultationHistory);

export default consultationRouter;
