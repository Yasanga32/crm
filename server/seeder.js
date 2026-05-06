import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";
import bcrypt from "bcryptjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const seedData = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);


        await User.deleteMany({});


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);


        const user = await User.create({
            name: "Test User",
            email: "admin@example.com",
            password: hashedPassword,
        });

        console.log("Test user created:");
        console.log(user);

        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();