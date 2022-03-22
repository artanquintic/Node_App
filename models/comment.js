import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Comment field is required"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Comment = new mongoose.model("Comment", commentSchema);

export default Comment;
