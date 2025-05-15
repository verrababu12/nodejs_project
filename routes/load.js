const express = require("express");
const axios = require("axios");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const router = express.Router();

router.get("/load", async (req, res) => {
  try {
    const { data: users } = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const { data: posts } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    const { data: comments } = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );

    await User.insertMany(users);
    await Post.insertMany(posts);
    await Comment.insertMany(comments);

    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to load and store data" });
  }
});

module.exports = router;
