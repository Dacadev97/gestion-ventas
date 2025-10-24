"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authValidators_1 = require("../validators/authValidators");
const router = (0, express_1.Router)();
exports.authRouter = router;
const controller = new AuthController_1.AuthController();
router.post("/login", authValidators_1.loginValidator, validationMiddleware_1.validateRequest, (0, asyncHandler_1.asyncHandler)(controller.login));
//# sourceMappingURL=auth.routes.js.map