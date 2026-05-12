import MenuItem from '../schema/MenuItem.js';

const getMenuItems = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const items = await MenuItem.find({ categoryId }).sort({ orderIndex: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Taom topilmadi" });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await MenuItem.findByIdAndDelete(id);
    res.json({ success: true, message: "Taom o‘chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Taom topilmadi" });

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability };