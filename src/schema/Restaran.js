import mongoose from "mongoose";

const restaranSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String },
  address: { type: String, required: true },
  phone: { type: String },
  logoUrl: { type: String },
  coverUrl: { type: String },
  instagram: { type: String },
  telegram: { type: String },
  workingHours: { type: String },
  isActive: { type: Boolean, default: true },
  qrCodeUrl: { type: String }
}, {
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Restaran = mongoose.model('Restaran', restaranSchema)

export default Restaran