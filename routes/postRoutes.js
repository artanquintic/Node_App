import { Router } from "express";
import {
  posts_getAll,
  posts_new_get,
  posts_new_post,
  posts_get,
  posts_edit_get,
  posts_edit_patch,
  posts_delete,
  posts_like,
} from "../controllers/postController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/posts/", requireAuth, posts_getAll);
router.get("/posts/new", requireAuth, posts_new_get);
router.post("/posts/new", requireAuth, posts_new_post);
router.get("/posts/:slug/:id", requireAuth, posts_get);
router.get("/posts/:slug/:id/edit", requireAuth, posts_edit_get);
router.patch("/posts/:slug/:id/edit", requireAuth, posts_edit_patch);
router.delete("/posts/:slug/:id", requireAuth, posts_delete);
router.patch("/posts/:slug/:id/like", requireAuth, posts_like);

export default router;
