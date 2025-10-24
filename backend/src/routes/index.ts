import { Router } from "express";

import { authRouter } from "./auth.routes";
import { captchaRouter } from "./captcha.routes";
import { saleRouter } from "./sales.routes";
import { userRouter } from "./users.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/captcha", captchaRouter);
router.use("/users", userRouter);
router.use("/sales", saleRouter);

export { router };
