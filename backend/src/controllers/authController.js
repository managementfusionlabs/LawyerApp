import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";






export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

    res.cookie(process.env.AUTH_COOKIE_NAME || "token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Register failed" });
  }
};

export const login = async (req, res) => {
  try {
    console.log("LOGIN HIT");
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
     console.log("Generated Token:", token);
     console.log("JWT SECRET USED:", process.env.JWT_SECRET);
    res.cookie(process.env.AUTH_COOKIE_NAME || "token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME || "token"];
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // FIXED

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });

    return res.json({ user });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};


export const logout = async (req, res) => {
  res.clearCookie(process.env.AUTH_COOKIE_NAME || "token", { path: "/" });
  return res.json({ message: "Logged out" });
};
