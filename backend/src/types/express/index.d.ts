import { RoleName } from "../../entities/Role";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      email: string;
      role: RoleName;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
