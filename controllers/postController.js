import mongoose from "mongoose";
import slugify from "slugify";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";
import Category from "../models/category.js";

const makeSlug = (title) => {
  // Slugify config options
  const options = {
    replace: /[*+~.()'"!:@]/g,
    lower: true,
    strict: false,
    locale: "en",
    trim: true,
  };
  const slug = slugify(title, options);

  return slug;
};

function truncate(str, num) {
  return str.split(" ").splice(0, num).join(" ");
}

export const posts_currentUser_get = async (req, res) => {
  try {
    const currentUser = res.locals.user;
    const posts = await Post.find({ "author._id": currentUser._id });
    res.render("posts", { posts: posts, truncate: truncate, title: "My Posts" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const posts_currentUser_bookmarks_get = async (req, res) => {
  try {
    const currentUser = res.locals.user;
    const bookmarks = await User.findById(currentUser._id, "bookmark").populate("bookmark").exec();
    res.render("posts", { posts: bookmarks.bookmark, truncate: truncate, title: "My Bookmarks" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const posts_getAll = async (req, res) => {
  try {
    const currentUser = res.locals.user;
    const posts = await Post.find().populate("category");
    res.render("posts", { posts: posts, truncate: truncate, title: `Welcome, ${currentUser.firstName}!` });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const posts_new_get = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("newPost", { categories: categories });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const posts_new_post = async (req, res) => {
  const { postTitle, postContent, postCategory } = req.body;
  const slug = makeSlug(postTitle);
  const currentUser = res.locals.user;

  try {
    const post = await Post.create({
      title: postTitle,
      content: postContent,
      author: currentUser,
      category: [postCategory],
      slug: slug,
    });

    res.redirect(`/posts/${slug}/${post._id}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const posts_get = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username",
        },
      })
      .populate("author")
      .populate("category")
      .exec();
    res.render("post", { post: post });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const posts_edit_get = async (req, res) => {
  const { id } = req.params;

  try {
    const categories = await Category.find();
    const post = await Post.findById(id).populate("category").exec();
    res.render("editPost", { post: post, categories: categories });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const posts_edit_patch = async (req, res) => {
  const { id, slug } = req.params;
  const { postTitle, postContent, postCategory } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { title: postTitle, content: postContent, category: postCategory };

    await Post.findByIdAndUpdate(id, updatedPost, { new: true });

    res.redirect(`/posts/${slug}/${id}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const posts_delete = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await Post.findByIdAndRemove(id);

    res.redirect("/posts");
  } catch (error) {
    console.log(error.message);
  }
};

export const posts_like = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const post = await Post.findById(id);
  await Post.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });

  res.redirect(req.get("referer"));
};

export const posts_comment = async (req, res) => {
  const { id } = req.params;
  const { postComment } = req.body;
  const currentUser = res.locals.user;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const post = await Post.findById(id);
  const comment = await Comment.create({
    comment: postComment,
    post: id,
    user: currentUser._id,
  });

  await Post.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true });

  res.redirect(req.get("referer"));
};

export const posts_bookmark = async (req, res) => {
  const { id } = req.params;
  const currentUser = res.locals.user;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  User.findOne({
    _id: currentUser.id,
    bookmark: {
      _id: id,
    },
  }).then(async (exists) => {
    if (exists) {
      await User.findByIdAndUpdate(currentUser.id, { $pull: { bookmark: id } }, { new: true });
    } else {
      await User.findByIdAndUpdate(currentUser.id, { $push: { bookmark: id } }, { new: true });
    }
  });

  res.redirect(req.get("referer"));
};
