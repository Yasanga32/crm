// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import User from "./models/User.js";
// import Lead from "./models/Lead.js";
// import Note from "./models/Note.js";
// import bcrypt from "bcryptjs";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// const seedData = async () => {
//     try {
//         console.log("Connecting to:", process.env.MONGODB_URL);
//         await mongoose.connect(process.env.MONGODB_URL);


//         await User.deleteMany({});


//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash("password123", salt);


//         const user = await User.create({
//             name: "Test User",
//             email: "admin@example.com",
//             password: hashedPassword,
//         });

//         console.log("Test user created:");
//         console.log(user);

//         await Note.deleteMany({});
//         await Lead.deleteMany({});
//         await Lead.create([
//             { name: "John Doe", email: "john@example.com", company: "ABC Corp", status: "New", value: 1000, owner: user._id },
//             { name: "Jane Smith", email: "jane@example.com", company: "XYZ Ltd", status: "Qualified", value: 5000, owner: user._id },
//             { name: "Bob Wilson", email: "bob@example.com", company: "Wilson & Co", status: "Won", value: 12000, owner: user._id },
//             { name: "Alice Brown", email: "alice@example.com", company: "Tech Start", status: "Lost", value: 2500, owner: user._id },
//             { name: "Charlie Davis", email: "charlie@example.com", company: "Global Inc", status: "Proposal Sent", value: 8000, owner: user._id },
//         ]);

//         console.log("Dummy leads seeded!");

//         process.exit();
//     } catch (error) {
//         console.error("Error seeding data:", error);
//         process.exit(1);
//     }
// };

// seedData();