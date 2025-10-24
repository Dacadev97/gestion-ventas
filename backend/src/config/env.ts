import dotenv from "dotenv";

dotenv.config();

const numberFromEnv = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: numberFromEnv(process.env.PORT, 4000),
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  captchaTtlSeconds: numberFromEnv(process.env.CAPTCHA_TTL_SECONDS, 120),
  initialAdminEmail: process.env.INITIAL_ADMIN_EMAIL ?? "admin@konecta.local",
  initialAdminPassword: process.env.INITIAL_ADMIN_PASSWORD ?? "Konecta#2024",
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: numberFromEnv(process.env.DB_PORT, 5432),
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    database: process.env.DB_NAME ?? "konecta"
  }
};
