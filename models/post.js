import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  author: {
    _id: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    username: { type: String, ref: "User" },
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
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
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  banner: {
    image: String,
    videoURL: String,
  },
  slug: String,
});

const Post = new mongoose.model("Post", postSchema);

export default Post;
