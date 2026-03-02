const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    portfolioUrl: { type: String, required: true },
    skillDomain: { type: String, required: true },
    experience: {
        type: String,
        enum: ['junior', 'mid', 'senior', 'lead'],
        default: 'mid'
    },
    bio: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // V2 Upgrades
    challengeAssigned: { type: String, default: '' },
    scoreBreakdown: {
        technical: { type: Number, min: 0, max: 100 },
        communication: { type: Number, min: 0, max: 100 },
        impact: { type: Number, min: 0, max: 100 }
    },
    badgeMetadata: {
        score: { type: Number },
        issuedAt: { type: Date },
        skill: { type: String },
        verificationId: { type: String }
    },
    rejectionReason: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
