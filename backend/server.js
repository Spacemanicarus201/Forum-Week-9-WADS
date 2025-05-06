// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv\config");

const app = express();
app.use(cors());
app.use(express.json());

const Task = require("./models/Task");
const User = require("./models/User");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("Access denied");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: "Signup failed" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

// TASK ROUTES (all protected)
app.get("/tasks", verifyToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

app.post("/tasks", verifyToken, async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description, userId: req.userId });
  await task.save();
  res.status(201).json(task);
});

app.put("/tasks/:id", verifyToken, async (req, res) => {
  const { title, description } = req.body;
  const updated = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { title, description }, { new: true });
  res.json(updated);
});

app.patch("/tasks/:id", verifyToken, async (req, res) => {
  const { completed } = req.body;
  const updated = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { completed }, { new: true });
  res.json(updated);
});

app.delete("/tasks/:id", verifyToken, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.status(204).send();
});

app.listen(5000, () => console.log("Server running on port 5000"));
