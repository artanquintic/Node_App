#!/usr/bin/env node
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import slugify from "slugify";
import User from "../models/user.js";
import Post from "../models/post.js";
import Category from "../models/category.js";
import Tag from "../models/tag.js";

// connect to MongoDB
mongoose.connect("mongodb://localhost:27017/growsariDB", { useNewUrlParser: true });

const makeSlug = (title) => {
  // Slugify config options
  const options = {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: false,
    locale: "en",
    trim: true,
  };

  const slug = slugify(title, options);

  return slug;
};

Category.deleteMany({})
  .then(() => {
    let categories = [];
    for (let i = 0; i < 15; i++) {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      categories.push({
        name: faker.lorem.word(),
        color: "#" + randomColor,
      });
    }
    console.log("Creating categories...");
    return Category.create(categories);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

Tag.deleteMany({})
  .then(() => {
    let tags = [];
    for (let i = 0; i < 15; i++) {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      tags.push({
        name: faker.lorem.word(),
        color: "#" + randomColor,
      });
    }
    console.log("Creating tags...");
    return Tag.create(tags);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

User.deleteMany({})
  .then(() => {
    const user = User.create({
      firstName: "test",
      lastName: "user",
      username: "testuser",
      password: "password",
      email: "testuser@gmail.com",
    });
    console.log("Creating user...");
    return user;
  })
  .then((user) => {
    Post.deleteMany({})
      .then(() => {
        let posts = [];
        for (let i = 0; i < 30; i++) {
          const title = faker.lorem.sentence(3);
          const slug = makeSlug(title);
          posts.push({
            title: faker.lorem.sentence(5),
            content: faker.lorem.paragraph(),
            author: user,
            createdAt: faker.date.past(),
            likeCount: Math.round(Math.random() * 20),
            viewCount: Math.round(Math.random() * 20),
            slug: slug,
          });
        }
        console.log("Creating posts...");
        return Post.create(posts);
      })
      .catch((e) => {
        console.log(e);
        process.exit(1);
      });
  })
  .then(() => {
    console.log("Done.");
    process.exit();
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
