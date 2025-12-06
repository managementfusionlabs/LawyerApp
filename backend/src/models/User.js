// models/User.js
import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  year: String,
  notes: String,
}, { _id: false });

const admissionSchema = new mongoose.Schema({
  jurisdiction: String, // e.g. "California"
  barNumber: String,
  admittedYear: Number,
}, { _id: false });

const socialSchema = new mongoose.Schema({
  linkedin: String,
  twitter: String,
  website: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  // profile
  title: { type: String, default: "Lawyer" },         // e.g. Senior Associate
  profileImage: { type: String, default: "" },        // store image URL
  phone: { type: String, default: "" },
  officeAddress: { type: String, default: "" },

  // professional details
  clientFacingName: { type: String, default: "" },    // optional display name
  practiceAreas: [{ type: String }],                  // e.g. ["Civil Litigation", "Family Law"]
  jurisdictions: [{ type: String }],                  // e.g. ["New York", "USA Federal"]
  admissions: [admissionSchema],                      // bar admissions
  education: [educationSchema],
  yearsOfExperience: { type: Number, default: 0 },
  languages: [{ type: String }],
  awards: [{ type: String }],
  publications: [{ title: String, link: String }],
  memberships: [{ type: String }],                    // e.g. "ABA", "State Bar Committee"

  // business / contact / availability
  consultationFee: { type: String, default: "" },     // e.g. "Free", "$100/hr"
  availabilityNotes: { type: String, default: "" },   // e.g. "Mon-Fri 9-5"
  website: { type: String, default: "" },
  social: socialSchema,

  // short bio & extended bio
  shortBio: { type: String, default: "" },
  longBio: { type: String, default: "" },

  role: { type: String, default: "lawyer" },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
