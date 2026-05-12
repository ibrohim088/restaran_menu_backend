import Restaurant from '../schema/Restaran.js';
import config from '../shared/config.js';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ adminId: req.user.id });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create({ ...req.body, adminId: req.user.id });
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateQR = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant || restaurant.adminId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Ruxsat yo'q" });
    }

    const menuUrl = `${config.BASE_URL}/public/menu/${restaurant._id}`;
    const qrPath = path.join(__dirname, '../uploads/qr', `${restaurant._id}.png`);

    await QRCode.toFile(qrPath, menuUrl, { width: 400 });

    restaurant.qrCodeUrl = `/uploads/qr/${restaurant._id}.png`;
    await restaurant.save();

    res.json({ success: true, data: { qrCodeUrl: restaurant.qrCodeUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getRestaurants, createRestaurant, generateQR };