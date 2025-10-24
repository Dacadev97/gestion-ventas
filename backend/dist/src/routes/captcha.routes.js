"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captchaRouter = void 0;
const express_1 = require("express");
const CaptchaController_1 = require("../controllers/CaptchaController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const router = (0, express_1.Router)();
exports.captchaRouter = router;
const controller = new CaptchaController_1.CaptchaController();
router.get("/", (0, asyncHandler_1.asyncHandler)(controller.generate));
//# sourceMappingURL=captcha.routes.js.map