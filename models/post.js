import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
});

const Post = new mongoose.model("Post", postSchema);

export default Post;
