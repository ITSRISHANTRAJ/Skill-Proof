const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['professional', 'employer', 'admin'],
    default: 'professional'
  },
  isVerified: { type: Boolean, default: false },
  // Professional fields
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  portfolioUrl: { type: String, default: '' },
  // Employer fields
  company: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
