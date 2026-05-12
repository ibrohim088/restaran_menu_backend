import Category from '../schema/Category.js';

// GET /categories/restaurants/:restaurantId
const getCategories = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const categories = await Category.find({ restaurantId }).sort({ orderIndex: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /categories/restaurants/:restaurantId
const createCategory = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const data = { ...req.body, restaurantId };

    if (req.file) {
      data.imageUrl = `/uploads/images/${req.file.filename}`;
    }

    const category = await Category.create(data);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /categories/:id
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategoriya topilmadi' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /categories/:id
const updateCategory = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = `/uploads/images/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategoriya topilmadi' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategoriya topilmadi' });
    }
    res.json({ success: true, message: "Kategoriya o'chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /categories/:id/toggle
const toggleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategoriya topilmadi' });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory, toggleCategory };
