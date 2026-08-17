import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const createDoctor = async () => {
  try {
    await connectDB();

    const existingDoctor = await User.findOne({
      email: "doctor@rekhahospital.com",
    });

    if (existingDoctor) {
      console.log("Doctor already exists.");

      console.log({
        id: existingDoctor._id,
        name: existingDoctor.name,
        email: existingDoctor.email,
        role: existingDoctor.role,
      });

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Doctor@123",
      12
    );

    const doctor = await User.create({
      name: "Dr. Rahul Sharma",
      email: "doctor@rekhahospital.com",
      phone: "9876543211",
      password: hashedPassword,
      role: "doctor",
      avatar: "",
      isVerified: true,
      isActive: true,
    });

    console.log("✅ Doctor created successfully!");

    console.log({
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
    });

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Create doctor error:",
      error
    );

    process.exit(1);
  }
};

createDoctor();