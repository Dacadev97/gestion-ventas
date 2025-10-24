import { Router } from "express";

import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateRequest } from "../middlewares/validationMiddleware";
import { loginValidator } from "../validators/authValidators";

const router = Router();
const controller = new AuthController();

router.post("/login", loginValidator, validateRequest, asyncHandler(controller.login));

export { router as authRouter };
