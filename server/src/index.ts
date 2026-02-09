import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { pool } from "./db/pool";
import { authRouter } from "./routes/auth";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.get("/health", async (_req, res) => {
  // проверим, что БД реально доступна
  const r = await pool.query("select 1 as ok");
  res.json({ ok: true, db: r.rows[0].ok });
});

app.use("/auth", authRouter);

app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
});
