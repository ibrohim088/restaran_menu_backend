import Category from '../schema/Category.js';

const getCategories = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const categories = await Category.find({ restaurantId }).sort({ orderIndex: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Kategoriya topilmadi" });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ success: true, message: "Kategoriya o‘chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: "Kategoriya topilmadi" });

    category.isActive = !category.isActive;
    await category.save();

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getCategories, createCategory, updateCategory, deleteCategory, toggleCategory };