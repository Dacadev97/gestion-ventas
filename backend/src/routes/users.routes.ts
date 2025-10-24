import { Router } from "express";

import { UserController } from "../controllers/UserController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { createUserValidator, updateUserValidator } from "../validators/userValidators";
import { RoleName } from "../entities/Role";

const router = Router();
const controller = new UserController();

router.use(authenticate, authorize(RoleName.ADMIN));

router.get("/", asyncHandler(controller.list));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", createUserValidator, validateRequest, asyncHandler(controller.create));
router.put("/:id", updateUserValidator, validateRequest, asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export { router as userRouter };
