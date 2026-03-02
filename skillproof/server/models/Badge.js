const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * Per-criterion summary stored on the badge for employer display
 */
const badgeCriterionSummarySchema = new mongoose.Schema({
    name: { type: String },
    score: { type: Number },
    maxScore: { type: Number },
}, { _id: false });

const badgeSchema = new mongoose.Schema({
    // --- Identity ---
    professional: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skillDomain: { type: String, required: true },
    badgeCode: {
        type: String,
        unique: true,
        default: () => 'SP-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
    },

    // --- Source references ---
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    verificationSession: { type: mongoose.Schema.Types.ObjectId, ref: 'VerificationSession', default: null },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', default: null },

    // --- Issuance ---
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issuedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },

    // --- Verification evidence (structured for employer display) ---
    verificationEvidence: {
        challengeTitle: { type: String, default: '' },
        challengeDifficulty: { type: String, default: '' },
        percentageScore: { type: Number, default: null },
        passingThreshold: { type: Number, default: null },
        totalScore: { type: Number, default: null },
        maxTotalScore: { type: Number, default: null },
        criteriaBreakdown: [badgeCriterionSummarySchema],
        feedbackSummary: { type: String, default: '' },
        evaluatedAt: { type: Date, default: null },
        hadScreenRecording: { type: Boolean, default: false },
    },

}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);
