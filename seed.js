import dotenv from 'dotenv';
import db from './src/db/index.js';
import User from './src/schema/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
  try {
    await db();
    
    const existing = await User.findOne({ email: 'superadmin@qrmenu.uz' });
    if (existing) {
      console.log("Superadmin allaqachon mavjud");
      process.exit(0);
    }

    const hashed = await bcrypt.hash('123456', 10);
    
    await User.create({
      fullName: "Super Admin",
      email: "superadmin@qrmenu.uz",
      password: hashed,
      role: "superadmin"
    });

    console.log("Superadmin yaratildi!");
    process.exit(0);
  } catch (error) {
    console.error("Seed xatosi:", error);
    process.exit(1);
  }
};

seed();