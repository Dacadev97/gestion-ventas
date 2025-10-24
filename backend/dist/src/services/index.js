"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captchaService = void 0;
const CaptchaService_1 = require("./CaptchaService");
const env_1 = require("../config/env");
exports.captchaService = new CaptchaService_1.CaptchaService(env_1.env.captchaTtlSeconds);
//# sourceMappingURL=index.js.map