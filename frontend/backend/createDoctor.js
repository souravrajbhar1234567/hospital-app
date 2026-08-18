import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const doctors = [
  {
    name: "Dr. Rahul Sharma",
    email: "doctor@rekhahospital.com",
    phone: "9876543211",
    specialization: "General Physician",
  },
  {
    name: "Dr. Priya Mehta",
    email: "priya@rekhahospital.com",
    phone: "9876543212",
    specialization: "Cardiologist",
  },
  {
    name: "Dr. Arjun Patel",
    email: "arjun@rekhahospital.com",
    phone: "9876543213",
    specialization: "Dermatologist",
  },
];

const createDoctors = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(
      "Doctor@123",
      12
    );

    for (const doctorData of doctors) {
      const existingDoctor = await User.findOne({
        email: doctorData.email,
      });

      if (existingDoctor) {
        console.log(
          `Doctor already exists: ${doctorData.email}`
        );
        continue;
      }

      const doctor = await User.create({
        ...doctorData,
        password: hashedPassword,
        role: "doctor",
        avatar: "",
        isVerified: true,
        isActive: true,
      });

      console.log("✅ Doctor created:", {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
      });
    }

    console.log("✅ Doctor setup completed.");
    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Create doctors error:",
      error
    );

    process.exit(1);
  }
};

createDoctors();