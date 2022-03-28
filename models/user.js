import mongoose from "mongoose";
import { genSalt, hash, compare } from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "First name is required."] },
  lastName: { type: String, required: [true, "Last name is required."] },
  // email: { type: String, required: [true, "Email is required."], unique: true },
  username: { type: String, required: [true, "Username is required."], unique: true },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  profile: {
    bio: String,
    profileImg: String,
  },
  bookmark: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect username");
};

userSchema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = new mongoose.model("User", userSchema);

export default User;
