import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";



// -----------------------------------------------------Register a new user-------------------------------------
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
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Register failed" });
  }
};

// -----------------------------------------------------Login an existing user-------------------------------------

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
     sameSite: "none",
     secure: true,
     maxAge: 1000 * 60 * 60 * 24 * 7,
          });

    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
};

// -----------------------------------------------------Get current user-------------------------------------

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

// -----------------------------------------------------Update user profile-------------------------------------
export const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };

    // whitelist fields to avoid mass assignment
    const allowed = [
      "name","title","profileImage","phone","officeAddress","clientFacingName",
      "practiceAreas","jurisdictions","admissions","education","yearsOfExperience",
      "languages","awards","publications","memberships","consultationFee",
      "availabilityNotes","website","social","shortBio","longBio"
    ];

    const payload = {};
    allowed.forEach((k) => {
      if (typeof updates[k] !== "undefined") payload[k] = updates[k];
    });

    const updated = await User.findByIdAndUpdate(req.user._id, payload, { new: true }).lean();

    return res.json({ user: updated });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -----------------------------------------------------Logout user-------------------------------------
export const logout = async (req, res) => {
  res.clearCookie(process.env.AUTH_COOKIE_NAME || "token", { path: "/" });
  return res.json({ message: "Logged out" });
};
