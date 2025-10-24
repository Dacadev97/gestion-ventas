"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaService = void 0;
const svg_captcha_1 = __importDefault(require("svg-captcha"));
const crypto_1 = require("crypto");
class CaptchaService {
    constructor(ttlSeconds) {
        this.ttlSeconds = ttlSeconds;
        this.store = new Map();
    }
    generate() {
        const captcha = svg_captcha_1.default.create({
            size: 6,
            ignoreChars: "0Oo1Il",
            noise: 2,
            color: true,
            background: "#f9fafb",
        });
        const id = (0, crypto_1.randomUUID)();
        const expiresAt = Date.now() + this.ttlSeconds * 1000;
        this.store.set(id, { value: captcha.text.toLowerCase(), expiresAt });
        return { id, data: captcha.data, expiresAt };
    }
    validate(id, value) {
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
exports.CaptchaService = CaptchaService;
//# sourceMappingURL=CaptchaService.js.map