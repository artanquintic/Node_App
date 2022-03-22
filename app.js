//jshint esversion:6
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import https from "https";
import fs from "fs";
import ejs from "ejs";
import _ from "lodash";
import cookieParser from "cookie-parser";
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";
import methodOverride from "method-override";

import authRoutes from "./routes/authRoutes.js";
import { requireAuth, checkUser } from "./middleware/authMiddleware.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/growsariDB", { useNewUrlParser: true });

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/feed", requireAuth, (req, res) => res.render("feed"));
app.use(authRoutes);
app.use(postRoutes);

// https
//   .createServer(
//     // Provide the private and public key to the server by reading each
//     // file's content with the readFileSync() method.
//     {
//       key: fs.readFileSync("./certificates/key.pem"),
//       cert: fs.readFileSync("./certificates/cert.pem"),
//     },
//     app
//   )
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
