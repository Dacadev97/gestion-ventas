import { Router } from "express";

import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authenticate } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { loginValidator } from "../validators/authValidators";

const router = Router();
const controller = new AuthController();

router.post("/login", loginValidator, validateRequest, asyncHandler(controller.login));
router.get("/me", authenticate, asyncHandler(controller.me));

export { router as authRouter };
