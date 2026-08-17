import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // NAME
    // ==========================================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    // ==========================================
    // EMAIL
    // ==========================================

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    // ==========================================
    // PASSWORD
    // ==========================================

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    // ==========================================
    // PHONE
    // ==========================================

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // DOCTOR SPECIALIZATION
    // ==========================================

    specialization: {
      type: String,
      trim: true,
      maxlength: [100, "Specialization cannot exceed 100 characters"],
      default: "General Physician",
    },

    // ==========================================
    // ROLE
    // ==========================================

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    // ==========================================
    // AVATAR
    // ==========================================

    avatar: {
      type: String,
      default: "",
    },

    // ==========================================
    // VERIFICATION
    // ==========================================

    isVerified: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // ACTIVE STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // LAST LOGIN
    // ==========================================

    lastLogin: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;