import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";
import Lead from "./models/Lead.js";
import Note from "./models/Note.js";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const seedData = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URL);

        // Clear existing data
        await User.deleteMany({});
        await Note.deleteMany({});
        await Lead.deleteMany({});

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        const user = await User.create({
            name: "LeadFlow Admin",
            email: "admin@example.com",
            password: hashedPassword,
        });

        console.log("✅ Admin user created: admin@example.com / password123");

        // Create Demo Leads
        await Lead.create([
            { 
                name: "Alex Rivera", 
                email: "alex@vertexsolutions.com", 
                company: "Vertex Solutions", 
                status: "Won", 
                value: 45000, 
                source: "LinkedIn",
                owner: user._id 
            },
            { 
                name: "Sarah Chen", 
                email: "sarah.c@quantumlabs.io", 
                company: "Quantum Labs", 
                status: "Qualified", 
                value: 12500, 
                source: "Web",
                owner: user._id 
            },
            { 
                name: "Marcus Thorne", 
                email: "m.thorne@globaltech.com", 
                company: "Global Tech Inc", 
                status: "Proposal Sent", 
                value: 8200, 
                source: "Referral",
                owner: user._id 
            },
            { 
                name: "Elena Rodriguez", 
                email: "elena@nexuscreative.es", 
                company: "Nexus Creative", 
                status: "New", 
                value: 3000, 
                source: "Cold Call",
                owner: user._id 
            },
            { 
                name: "David Park", 
                email: "david@skylineventures.com", 
                company: "Skyline Ventures", 
                status: "Contacted", 
                value: 25000, 
                source: "Conference",
                owner: user._id 
            },
            { 
                name: "Jordan Smith", 
                email: "jordan@stellar.co", 
                company: "Stellar Co", 
                status: "Lost", 
                value: 5000, 
                source: "Email Campaign",
                owner: user._id 
            }
        ]);

        console.log("✅ 6 Strategic leads seeded!");
        console.log("🚀 Seeding complete!");
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

seedData();