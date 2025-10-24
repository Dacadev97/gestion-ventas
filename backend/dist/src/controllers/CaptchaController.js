"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaController = void 0;
const services_1 = require("../services");
class CaptchaController {
    constructor() {
        this.generate = async (_req, res) => {
            const captcha = services_1.captchaService.generate();
            res.json(captcha);
        };
    }
}
exports.CaptchaController = CaptchaController;
//# sourceMappingURL=CaptchaController.js.map