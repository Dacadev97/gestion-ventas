"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_routes_1 = require("./auth.routes");
const captcha_routes_1 = require("./captcha.routes");
const sales_routes_1 = require("./sales.routes");
const users_routes_1 = require("./users.routes");
const router = (0, express_1.Router)();
exports.router = router;
router.use("/auth", auth_routes_1.authRouter);
router.use("/captcha", captcha_routes_1.captchaRouter);
router.use("/users", users_routes_1.userRouter);
router.use("/sales", sales_routes_1.saleRouter);
//# sourceMappingURL=index.js.map