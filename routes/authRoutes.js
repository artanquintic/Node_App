import { Router } from "express";
import { signup_get, signup_post, login_get, login_post, logout_get } from "../controllers/authController.js";

const router = Router();

router.route("/signup").get(signup_get).post(signup_post);
router.route("/login").get(login_get).post(login_post);
router.get("/logout", logout_get);

export default router;
