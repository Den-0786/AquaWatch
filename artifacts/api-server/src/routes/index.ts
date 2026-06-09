import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sensorsRouter from "./sensors";
import readingsRouter from "./readings";
import alertsRouter from "./alerts";
import dashboardRouter from "./dashboard";
import thresholdsRouter from "./thresholds";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sensorsRouter);
router.use(readingsRouter);
router.use(alertsRouter);
router.use(dashboardRouter);
router.use(thresholdsRouter);

export default router;
