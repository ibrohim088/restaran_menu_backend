import Restaurant from '../schema/Restaran.js';
import Category from '../schema/Category.js';
import MenuItem from '../schema/MenuItem.js';

// GET /public/menu/:restaurantId  — to'liq menyu
const getPublicMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId).select('-adminId -qrCodeUrl');
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ success: false, message: 'Restoran topilmadi yoki faol emas' });
    }

    const categories = await Category.find({ restaurantId, isActive: true }).sort({ orderIndex: 1 });

    const menu = [];
    for (const category of categories) {
      const items = await MenuItem.find({ categoryId: category._id, isAvailable: true }).sort({ orderIndex: 1 });
      menu.push({ ...category.toObject(), items });
    }

    // Mashhur taomlar alohida
    const popularItems = await MenuItem.find({
      categoryId: { $in: categories.map((c) => c._id) },
      isPopular: true,
      isAvailable: true,
    });

    res.json({ success: true, data: { restaurant, menu, popularItems } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /public/menu/:restaurantId/categories
const getPublicCategories = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const categories = await Category.find({ restaurantId, isActive: true }).sort({ orderIndex: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getPublicMenu, getPublicCategories };
