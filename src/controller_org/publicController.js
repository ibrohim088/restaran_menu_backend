import Restaurant from '../schema/Restaran.js';
import Category from '../schema/Category.js';
import MenuItem from '../schema/MenuItem.js';

const getPublicMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId).select('-adminId -qrCodeUrl');
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ success: false, message: "Restoran topilmadi yoki faol emas" });
    }

    const categories = await Category.find({ 
      restaurantId, 
      isActive: true 
    }).sort({ orderIndex: 1 });

    const menu = [];

    for (const category of categories) {
      const items = await MenuItem.find({ 
        categoryId: category._id, 
        isAvailable: true 
      }).sort({ orderIndex: 1 });

      menu.push({
        ...category.toObject(),
        items
      });
    }

    res.json({
      success: true,
      data: {
        restaurant,
        menu
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getPublicMenu };