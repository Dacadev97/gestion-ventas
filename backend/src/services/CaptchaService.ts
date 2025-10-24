import svgCaptcha from "svg-captcha";
import { randomUUID } from "crypto";

interface CaptchaEntry {
  value: string;
  expiresAt: number;
}

export class CaptchaService {
  private readonly store = new Map<string, CaptchaEntry>();

  constructor(private readonly ttlSeconds: number) {}

  generate() {
    const captcha = svgCaptcha.create({
      size: 6,
      ignoreChars: "0Oo1Il",
      noise: 2,
      color: true,
      background: "#f9fafb",
    });

    const id = randomUUID();
    const expiresAt = Date.now() + this.ttlSeconds * 1000;

    this.store.set(id, { value: captcha.text.toLowerCase(), expiresAt });

    return { id, data: captcha.data, expiresAt };
  }

  validate(id: string, value: string) {
    const entry = this.store.get(id);

    if (!entry) {
      return false;
    }

    this.store.delete(id);

    if (Date.now() > entry.expiresAt) {
      return false;
    }

    return entry.value === value.toLowerCase();
  }
}
