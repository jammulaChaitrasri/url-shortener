import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import shortUrl from "./model/shortStore.js";
import cors from "cors";
import User from "./model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB connection error:", err));

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://url-shortener-1-5ux6.onrender.com",
      "https://url-shortener-five-pink.vercel.app",
      "https://url-shortener-git-main-nishinishanth88-2890s-projects.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register endpoint
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "All fields required" });
  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) return res.status(400).json({ error: "User already exists" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  res.json({ message: "User registered", user: { username, email, _id: user._id } });
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, user: { username, email: user.email, _id: user._id } });
});

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Create short URL (with auth, custom code, analytics)
app.post("/short", auth, async (req, res) => {
  const { full, customCode } = req.body;
  if (!full) return res.status(400).json({ error: "URL required" });
  let shortCode;
  if (customCode) {
    // Check if custom code is unique
    const exists = await shortUrl.findOne({ short: customCode });
    if (exists) return res.status(400).json({ error: "Custom code already in use" });
    shortCode = customCode;
  }
  let found = await shortUrl.find({ full, user: req.userId });
  if (found.length > 0) {
    res.send(found);
  } else {
    const newShort = await shortUrl.create({
      full,
      short: shortCode, // undefined if not custom
      user: req.userId,
    });
    found = [newShort];
    res.send(found);
  }
});

// Get all links for the authenticated user
app.get("/my-links", auth, async (req, res) => {
  const links = await shortUrl.find({ user: req.userId });
  res.json(links);
});

// Redirect and increment clicks
app.get("/:shortUrl", async (req, res) => {
  const short = await shortUrl.findOneAndUpdate(
    { short: req.params.shortUrl },
    { $inc: { clicks: 1 } },
    { new: true }
  );
  if (short == null) return res.sendStatus(404);
  res.redirect(`${short.full}`);
});

let port = process.env.PORT || 5001;

app.listen(port, function () {
  console.log("Server started successfully on port: ", port);
});
