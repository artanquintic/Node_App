import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  author: {
    _id: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    username: { type: String, ref: "User" },
  },
  tags: [String],
  likeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  slug: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Post = new mongoose.model("Post", postSchema);

export default Post;
