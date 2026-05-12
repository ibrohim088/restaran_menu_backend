import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../schema/User.js';
import generateToken from '../util/createToken.js';
import config from '../shared/config.js';

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Email yoki parol noto'g'ri" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Akkauntingiz faolsizlantirilgan' });
    }

    const accessToken = generateToken(user, config.JWT_SECRET_KEY, config.JWT_EXPIRES_IN)
    const refreshToken = generateToken(user, config.JWT_REFRESH_SECRET, config.JWT_REFRESH_EXPIRES_IN);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      data: { user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /auth/refresh
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token kerak' });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Yaroqsiz refresh token' });
    }

    const newAccessToken = generateToken(user, config.JWT_SECRET_KEY, config.JWT_EXPIRES_IN);

    res.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Yaroqsiz refresh token' });
  }
};

// GET /auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /auth/logout
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.json({ success: true, message: "Tizimdan muvaffaqiyatli chiqildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /auth/change-password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Eski parol noto'g'ri" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Parol muvaffaqiyatli yangilandi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { login, refresh, getMe, logout, changePassword };
