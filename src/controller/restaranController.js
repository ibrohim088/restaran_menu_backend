import Restaurant from '../schema/Restaran.js';
import config from '../shared/config.js';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { getIPv4 } from '../db/network.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// GET /restaran
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ adminId: req.user.id }).sort({ created_at: -1 });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /restaran
const createRestaurant = async (req, res) => {
  try {
    const data = { ...req.body, adminId: req.user.id };

    // Rasm fayllar upload qilingan bo'lsa
    if (req.files) {
      if (req.files.logo) data.logoUrl = `/uploads/images/${req.files.logo[0].filename}`;
      if (req.files.cover) data.coverUrl = `/uploads/images/${req.files.cover[0].filename}`;
    }

    const restaurant = await Restaurant.create(data);
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /restaran/:id
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      adminId: req.user.id,
    });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restoran topilmadi' });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /restaran/:id
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, adminId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restoran topilmadi' });
    }

    const data = { ...req.body };

    // Yangi rasmlar yuklangan bo'lsa
    if (req.files) {
      if (req.files.logo) data.logoUrl = `/uploads/images/${req.files.logo[0].filename}`;
      if (req.files.cover) data.coverUrl = `/uploads/images/${req.files.cover[0].filename}`;
    }

    const updated = await Restaurant.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /restaran/:id
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({
      _id: req.params.id,
      adminId: req.user.id,
    });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restoran topilmadi' });
    }
    res.json({ success: true, message: "Restoran o'chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// QR kod generatsiya qilish
const generateQR = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, adminId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restoran topilmadi' });
    }

    // So'rov localhost dan kelganmi yoki network IP dan?
    // Shunga qarab to'g'ri frontend URL tanlanadi
    const requestHost = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const isLocalRequest = requestHost.includes('127.0.0.1') || requestHost.includes('::1') || requestHost.includes('localhost');

    let frontendBaseUrl;
    if (isLocalRequest) {
      // Brauzer localhost dan — localhost URL
      frontendBaseUrl = config.FRONT_BASE_URL || 'http://localhost:5173';
    } else {
      // Telefon yoki boshqa qurilma — network IP URL
      const networkIP = getIPv4();
      frontendBaseUrl = config.FRONT_NETWORK_URL || `http://${networkIP}:5173`;
    }

    const menuUrl = `${frontendBaseUrl}/public/menu/${restaurant._id}`;

    const qrDir = path.join(__dirname, '../../uploads/qr');
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

    const fileName = `${restaurant._id}.png`;
    const filePath = path.join(qrDir, fileName);

    await QRCode.toFile(filePath, menuUrl, {
      color: { dark: '#1E3A5F', light: '#FFFFFF' },
      width: 400,
      margin: 2,
    });

    restaurant.qrCodeUrl = `/uploads/qr/${fileName}`;
    await restaurant.save();

    res.json({ success: true, data: { qrCodeUrl: restaurant.qrCodeUrl, menuUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getRestaurants, createRestaurant, getRestaurantById, updateRestaurant, deleteRestaurant, generateQR };