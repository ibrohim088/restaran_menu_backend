import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  price: { type: Number, required: true, min: 0 },
  weight: { type: String },
  calories: { type: String },
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  orderIndex: { type: Number, default: 0 }
}, {
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const MenuItem = mongoose.model('MenuItem', menuItemSchema)

export default MenuItem