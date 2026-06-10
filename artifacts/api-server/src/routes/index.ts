import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./authRoutes.js";
import landingRouter from "./landingRoutes.js";
import pengajuanRouter from "./pengajuanRoutes.js";
import dokumenRouter from "./dokumenRoutes.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(landingRouter);
router.use(pengajuanRouter);
router.use(dokumenRouter);

export default router;
