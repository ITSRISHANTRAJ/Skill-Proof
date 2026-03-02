const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skillDomain: { type: String, required: true },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    instructions: { type: String, default: '' },
    timeLimit: { type: Number, default: 48 }, // hours
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
