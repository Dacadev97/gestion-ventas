import { Router } from "express";

import { CaptchaController } from "../controllers/CaptchaController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();
const controller = new CaptchaController();

router.get("/", asyncHandler(controller.generate));

export { router as captchaRouter };
