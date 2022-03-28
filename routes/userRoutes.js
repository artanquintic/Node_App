import { Router } from "express";
import { profile_get, profile_edit_get, profile_edit_patch } from "../controllers/userController.js";

const router = Router();

router.get("/profile/", profile_get);
router.get("/profile/edit", profile_edit_get);
router.patch("/profile/edit", profile_edit_patch);
export default router;
