import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

// 🔥 Fix path manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const seedAdmin = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);

        // ❌ Remove existing admin
        await User.deleteMany({ email: "admin@gmail.com" });

        // ✅ Hash password manually (since we removed the hook from the model)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        // ✅ Create admin
        const admin = await User.create({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("✅ Admin user created:");
        console.log(admin);

        process.exit();
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();