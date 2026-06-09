import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./authRoutes.js";
import landingRouter from "./landingRoutes.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(landingRouter);

export default router;
