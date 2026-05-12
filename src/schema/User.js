import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String, default: null }
}, {
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const User = mongoose.model('User', userSchema)

export default User