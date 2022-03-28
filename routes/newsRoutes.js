import { Router } from "express";
import { news_get } from "../controllers/newsController.js";

const router = Router();

router.get("/news", news_get);

export default router;
