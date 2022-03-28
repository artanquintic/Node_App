import mongoose from "mongoose";
import User from "../models/user.js";

export const profile_get = (req, res) => {
  res.render("userProfile");
};

export const profile_edit_get = (req, res) => {
  res.render("editUserProfile");
};

export const profile_edit_patch = async (req, res) => {
  const { firstName, lastName, profileBio } = req.body;
  const currentUser = res.locals.user;

  if (!mongoose.Types.ObjectId.isValid(currentUser._id))
    return res.status(404).send(`No user with id: ${currentUser._id}`);

  try {
    await User.findByIdAndUpdate(
      currentUser._id,
      { $set: { firstName: firstName, lastName: lastName, profile: { bio: profileBio } } },
      { new: true }
    );

    res.redirect("/profile");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
