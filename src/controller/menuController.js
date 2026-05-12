import MenuItem from '../schema/MenuItem.js';

// GET /menu/categories/:categoryId
const getMenuItems = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const items = await MenuItem.find({ categoryId }).sort({ orderIndex: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /menu/categories/:categoryId
const createMenuItem = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const data = { ...req.body, categoryId };

    if (req.file) {
      data.imageUrl = `/uploads/images/${req.file.filename}`;
    }

    const item = await MenuItem.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /menu/:id
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Taom topilmadi' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /menu/:id
const updateMenuItem = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = `/uploads/images/${req.file.filename}`;
    }

    const item = await MenuItem.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Taom topilmadi' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /menu/:id
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Taom topilmadi' });
    }
    res.json({ success: true, message: "Taom o'chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /menu/:id/toggle
const toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Taom topilmadi' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getMenuItems, createMenuItem, getMenuItemById, updateMenuItem, deleteMenuItem, toggleAvailability };
