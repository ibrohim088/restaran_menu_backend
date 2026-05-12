import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  orderIndex: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Category = mongoose.model('Category', categorySchema)

export default Category