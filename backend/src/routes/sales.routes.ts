import { Router } from "express";

import { SaleController } from "../controllers/SaleController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  createSaleValidator,
  saleFiltersValidator,
  updateSaleValidator,
} from "../validators/saleValidators";
import { RoleName } from "../entities/Role";

const router = Router();
const controller = new SaleController();

router.use(authenticate, authorize(RoleName.ADMIN, RoleName.ADVISOR));

router.get("/", saleFiltersValidator, validateRequest, asyncHandler(controller.list));
router.get("/stats", asyncHandler(controller.stats));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", createSaleValidator, validateRequest, asyncHandler(controller.create));
router.put("/:id", updateSaleValidator, validateRequest, asyncHandler(controller.update));
router.patch("/:id/status", asyncHandler(controller.updateStatus));
router.delete("/:id", asyncHandler(controller.delete));

export { router as saleRouter };
