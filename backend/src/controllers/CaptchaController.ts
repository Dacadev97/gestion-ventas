import { Request, Response } from "express";

import { captchaService } from "../services";

export class CaptchaController {
  generate = async (_req: Request, res: Response) => {
    const captcha = captchaService.generate();

    res.json(captcha);
  };
}
