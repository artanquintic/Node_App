import express from "express";
import mongoose from "mongoose";
import slugify from "slugify";
import Post from "../models/post.js";
// const router = express.Router();
const makeSlug = (title) => {
  // Slugify config options
  const options = {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: false,
    locale: "en",
    trim: true,
  };

  const slug = slugify(title, options);

  return slug;
};

export const posts_getAll = async (req, res) => {
  try {
    const posts = await Post.find();
    res.render("posts", { posts: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const posts_new_get = async (req, res) => {
  res.render("newPost");
};

export const posts_new_post = async (req, res) => {
  const { postTitle, postContent } = req.body;
  const slug = makeSlug(postTitle);

  try {
    const post = await Post.create({
      title: postTitle,
      content: postContent,
      slug: slug,
    });

    res.status(201).json({ post: post._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const posts_get = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById({ _id: id });
    res.render("post", { post: post });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const posts_edit_get = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById({ _id: id });
    res.render("editPost", { post: post });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const posts_edit_patch = async (req, res) => {
  const { id, slug } = req.params;
  const { postTitle, postContent } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { title: postTitle, content: postContent, _id: id };

    await Post.findByIdAndUpdate(id, updatedPost, { new: true });

    res.redirect("/posts/" + slug + "/" + id);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const posts_delete = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await Post.findByIdAndRemove({ _id: id });

    res.redirect("/posts");
  } catch (error) {
    console.log(error.message);
  }
};

export const posts_like = async (req, res) => {
  res.render("/posts");
};
