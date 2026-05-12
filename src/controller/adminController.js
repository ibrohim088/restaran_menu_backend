import User from '../schema/User.js';
import bcrypt from 'bcryptjs';

// GET /admins
const getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { role: 'admin' };
    if (req.query.search) {
      filter.$or = [
        { fullName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const admins = await User.find(filter)
      .select('-password -refreshToken')
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    res.json({
      success: true,
      data: admins,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /admins
const createAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Bu email allaqachon mavjud' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({ fullName, email, password: hashedPassword, role: 'admin' });

    const { password: _, refreshToken: __, ...adminData } = admin.toObject();
    res.status(201).json({ success: true, message: 'Admin yaratildi', data: adminData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /admins/:id
const getAdminById = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.params.id, role: 'admin' }).select('-password -refreshToken');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin topilmadi' });
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /admins/:id
const updateAdmin = async (req, res) => {
  try {
    const { fullName, email, password, isActive } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const admin = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'admin' },
      updateData,
      { returnDocument: 'after' }
    ).select('-password -refreshToken');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin topilmadi' });
    }

    res.json({ success: true, message: 'Admin yangilandi', data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /admins/:id  (soft delete)
// const deleteAdmin = async (req, res) => {
//   try {
//     const admin = await User.findOneAndUpdate(
//       { _id: req.params.id, role: 'admin' },
//       { isActive: false },
//       { returnDocument: 'after' }
//     );
    
//     if (!admin) {
//       return res.status(404).json({ success: false, message: 'Admin topilmadi' });
//     }
//     res.json({ success: true, message: "Admin o'chirildi (deaktivatsiya)" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const deleteAdmin = async (req, res) => {
  await User.findOneAndDelete({ _id: req.params.id, role: 'admin' });
  res.json({ success: true, message: "Admin to'liq o'chirildi" });
};

// PATCH /admins/:id/toggle
const toggleAdmin = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.params.id, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin topilmadi' });
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    res.json({
      success: true,
      message: `Admin ${admin.isActive ? 'faollashtirildi' : 'faolsizlantirildi'}`,
      data: { id: admin._id, isActive: admin.isActive },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllAdmins, createAdmin, getAdminById, updateAdmin, deleteAdmin, toggleAdmin };
