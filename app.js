import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import _ from "lodash";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import moment from "moment";

import { requireAuth, checkUser } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/growsariDB", { useNewUrlParser: true });

// routes
app.use("*", checkUser);
app.get("/", (req, res) => {
  if (res.locals.user) return res.redirect("/posts");
  res.render("home");
});
app.use(authRoutes);
app.use("/posts", requireAuth);
app.use(postRoutes);
app.use("/profile", requireAuth);
app.use(userRoutes);
app.use(newsRoutes);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
