const mongoose = require('mongoose');

/**
 * Scoring criterion — each evaluated dimension of the challenge
 */
const scoringCriterionSchema = new mongoose.Schema({
    name: { type: String, required: true },        // e.g. "Code Quality"
    description: { type: String, default: '' },    // what this criterion measures
    score: { type: Number, required: true, min: 0 }, // awarded score
    maxScore: { type: Number, required: true, min: 1 }, // max possible
    comment: { type: String, default: '' },         // evaluator's note on this criterion
}, { _id: false });

/**
 * Screen-recording / submission artifact metadata
 */
const recordingMetadataSchema = new mongoose.Schema({
    url: { type: String, required: true },          // link to recording (Loom, Drive, S3, etc.)
    durationSeconds: { type: Number, default: 0 },  // recording length
    fileSizeMB: { type: Number, default: 0 },       // approximate file size
    format: { type: String, default: 'video/mp4' }, // MIME type
    capturedAt: { type: Date, default: null },       // when recording was made
    notes: { type: String, default: '' },            // professional's own notes on recording
}, { _id: false });

const verificationSessionSchema = new mongoose.Schema({
    // --- Core refs ---
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },

    // --- Lifecycle ---
    status: {
        type: String,
        enum: ['assigned', 'submitted', 'evaluated', 'passed', 'failed'],
        default: 'assigned',
    },

    // --- Assignment ---
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date, default: Date.now },
    deadline: { type: Date, default: null },         // when challenge must be submitted by

    // --- Submission ---
    submittedAt: { type: Date, default: null },
    submissionUrl: { type: String, default: '' },    // live demo / repo / artefact link
    submissionNotes: { type: String, default: '' },  // professional write-up
    recording: { type: recordingMetadataSchema, default: null },

    // --- Evaluation ---
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    evaluatedAt: { type: Date, default: null },
    scoringCriteria: [scoringCriterionSchema],        // per-dimension scores
    totalScore: { type: Number, default: 0 },         // sum of scoringCriteria scores
    maxTotalScore: { type: Number, default: 0 },      // sum of maxScores
    percentageScore: { type: Number, default: 0 },    // totalScore / maxTotalScore * 100
    passingThreshold: { type: Number, default: 70 },  // % required to pass
    adminNotes: { type: String, default: '' },         // private notes from evaluator
    feedbackForProfessional: { type: String, default: '' }, // shared with professional

}, { timestamps: true });

// Virtual: did the session pass?
verificationSessionSchema.virtual('passed').get(function () {
    return this.percentageScore >= this.passingThreshold;
});

verificationSessionSchema.set('toJSON', { virtuals: true });
verificationSessionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('VerificationSession', verificationSessionSchema);
