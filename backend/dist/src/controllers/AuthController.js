"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AppError_1 = require("../errors/AppError");
const services_1 = require("../services");
const UserService_1 = require("../services/UserService");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const mapUserResponse = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});
class AuthController {
    constructor(userService = new UserService_1.UserService()) {
        this.userService = userService;
        this.login = async (req, res) => {
            const { email, password, captchaId, captchaValue } = req.body;
            const captchaValid = services_1.captchaService.validate(captchaId, captchaValue);
            if (!captchaValid) {
                throw new AppError_1.AppError("Captcha inválido", 400);
            }
            const user = await this.userService.findByEmailWithPassword(email);
            if (!user) {
                throw new AppError_1.AppError("Credenciales inválidas", 401);
            }
            const passwordMatches = await (0, password_1.comparePassword)(password, user.password);
            if (!passwordMatches) {
                throw new AppError_1.AppError("Credenciales inválidas", 401);
            }
            const token = (0, jwt_1.signAccessToken)({
                sub: user.id,
                email: user.email,
                role: user.role.name,
            });
            const responseUser = await this.userService.getById(user.id);
            return res.json({
                token,
                user: mapUserResponse(responseUser),
            });
        };
        this.me = async (req, res) => {
            const authUser = req.user;
            if (!authUser) {
                throw new AppError_1.AppError("No autorizado", 401);
            }
            const user = await this.userService.getById(authUser.id);
            return res.json(mapUserResponse(user));
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map