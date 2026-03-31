import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import categoriesRouter from "./categories";
import profileRouter from "./profile";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(categoriesRouter);
router.use(profileRouter);

export default router;
