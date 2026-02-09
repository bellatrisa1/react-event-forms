import dotenv from "dotenv";
dotenv.config();

function must(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT ?? 5050),

  DB_HOST: must("DB_HOST"),
  DB_PORT: Number(process.env.DB_PORT ?? 5432),
  DB_NAME: must("DB_NAME"),
  DB_USER: must("DB_USER"),
  DB_PASSWORD: must("DB_PASSWORD"),

  JWT_SECRET: must("JWT_SECRET"),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
