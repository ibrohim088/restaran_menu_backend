import User from '../schema/User.js';
import bcrypt from 'bcryptjs';

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password -refreshToken');
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Bu email allaqachon mavjud" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({ fullName, email, password: hashedPassword, role: 'admin' });

    res.status(201).json({ success: true, message: "Admin yaratildi", data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllAdmins, createAdmin };