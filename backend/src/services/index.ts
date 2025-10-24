import { CaptchaService } from "./CaptchaService";
import { env } from "../config/env";

export const captchaService = new CaptchaService(env.captchaTtlSeconds);
