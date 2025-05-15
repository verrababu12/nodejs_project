const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const router = express.Router();

router.delete("/users", async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "All users deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete users" });
  }
});

router.delete("/users/:userId", async (req, res) => {
  try {
    const result = await User.deleteOne({ id: parseInt(req.params.userId) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/users/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findOne({ id: userId }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ userId }).lean();
    for (let post of posts) {
      post.comments = await Comment.find({ postId: post.id }).lean();
    }

    user.posts = posts;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

router.put("/users", async (req, res) => {
  try {
    const newUser = req.body;

    const exists = await User.findOne({ id: newUser.id });
    if (exists) return res.status(409).json({ error: "User already exists" });

    const { posts, ...userData } = newUser;

    await User.create(userData);

    for (const post of posts || []) {
      const { comments, ...postData } = post;

      await Post.create(postData);

      for (const comment of comments || []) {
        await Comment.create(comment);
      }
    }

    res.setHeader("Link", `/users/${newUser.id}`);
    res.status(201).json({ message: "User, posts, and comments created" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid user data" });
  }
});

router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

router.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

module.exports = router;
