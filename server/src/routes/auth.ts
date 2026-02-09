import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";
import { env } from "../config/env";
import { requireAuth, type AuthedRequest } from "../middleware/auth";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function setAuthCookie(res: any, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // локально false. На проде будет true (https)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid body", issues: parsed.error.issues });

  const { name, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `insert into users (name, email, password_hash)
       values ($1, $2, $3)
       on conflict (email) do nothing
       returning id, name, email`,
      [name, email, passwordHash]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);

    return res.json({ user });
  } catch (e: any) {
    return res.status(500).json({ message: "Server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid body", issues: parsed.error.issues });

  const { email, password } = parsed.data;

  const result = await pool.query(
    `select id, name, email, password_hash
     from users
     where email = $1
     limit 1`,
    [email]
  );

  if (result.rowCount === 0) return res.status(401).json({ message: "Wrong email or password" });

  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Wrong email or password" });

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "7d" });
  setAuthCookie(res, token);

  return res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const result = await pool.query(`select id, name, email from users where id = $1`, [userId]);
  if (result.rowCount === 0) return res.status(404).json({ message: "User not found" });
  return res.json({ user: result.rows[0] });
});
