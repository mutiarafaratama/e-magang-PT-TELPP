import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok", app: "e-Magang TELPP API" });
});

router.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "e-Magang TELPP API" });
});

export default router;
