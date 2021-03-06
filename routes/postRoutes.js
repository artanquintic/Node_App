import { Router } from "express";
import {
  posts_getAll,
  posts_new_get,
  posts_new_post,
  posts_currentUser_get,
  posts_currentUser_bookmarks_get,
  posts_get,
  posts_edit_get,
  posts_edit_patch,
  posts_delete,
  posts_like,
  posts_comment,
  posts_bookmark,
} from "../controllers/postController.js";

const router = Router();

router.get("/posts/", posts_getAll);
router.get("/posts/new", posts_new_get);
router.post("/posts/new", posts_new_post);
router.get("/posts/my-posts", posts_currentUser_get);
router.get("/posts/my-bookmarks", posts_currentUser_bookmarks_get);
router.get("/posts/:slug/:id", posts_get);
router.get("/posts/:slug/:id/edit", posts_edit_get);
router.patch("/posts/:slug/:id/edit", posts_edit_patch);
router.delete("/posts/:slug/:id", posts_delete);
router.patch("/posts/:slug/:id/like", posts_like);
router.post("/posts/:slug/:id/comment", posts_comment);
router.get("/posts/:slug/:id/bookmark", posts_bookmark);

export default router;
