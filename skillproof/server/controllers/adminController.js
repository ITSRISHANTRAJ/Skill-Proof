const Application = require('../models/Application');
const User = require('../models/User');
const Badge = require('../models/Badge');
const Challenge = require('../models/Challenge');

// GET /api/admin/pending-applications
exports.getPendingApplications = async (req, res, next) => {
    try {
        const { status } = req.query; // optional filter: pending | approved | rejected | all
        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        const applications = await Application.find(filter)
            .populate('user', 'name email isVerified')
            .populate('reviewedBy', 'name')
            .sort({ createdAt: -1 });

        const stats = {
            total: await Application.countDocuments(),
            pending: await Application.countDocuments({ status: 'pending' }),
            approved: await Application.countDocuments({ status: 'approved' }),
            rejected: await Application.countDocuments({ status: 'rejected' }),
        };

        res.json({ applications, stats });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/approve/:id
exports.approveApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id).populate('user');
        if (!application) return res.status(404).json({ message: 'Application not found' });
        if (application.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending applications can be approved' });
        }

        application.status = 'approved';
        application.reviewedBy = req.user.id;
        application.reviewedAt = new Date();
        await application.save();

        // Mark user as verified
        await User.findByIdAndUpdate(application.user._id, { isVerified: true });

        // Issue badge
        const existingBadge = await Badge.findOne({ professional: application.user._id });
        if (!existingBadge) {
            await Badge.create({
                professional: application.user._id,
                skillDomain: application.skillDomain,
                application: application._id,
                issuedBy: req.user.id,
            });
        }

        res.json({ message: 'Application approved and badge issued successfully', application });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/reject/:id
exports.rejectApplication = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        if (application.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending applications can be rejected' });
        }

        application.status = 'rejected';
        application.rejectionReason = reason || 'Did not meet verification standards.';
        application.reviewedBy = req.user.id;
        application.reviewedAt = new Date();
        await application.save();

        res.json({ message: 'Application rejected', application });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/create-challenge
exports.createChallenge = async (req, res, next) => {
    try {
        const { title, description, skillDomain, difficulty, instructions, timeLimit } = req.body;

        if (!title || !description || !skillDomain) {
            return res.status(400).json({ message: 'Title, description and skill domain are required' });
        }

        const challenge = await Challenge.create({
            title,
            description,
            skillDomain,
            difficulty: difficulty || 'medium',
            instructions: instructions || '',
            timeLimit: timeLimit || 48,
            createdBy: req.user.id,
        });

        res.status(201).json({ message: 'Challenge created successfully', challenge });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/challenges
exports.getChallenges = async (req, res, next) => {
    try {
        const challenges = await Challenge.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
        res.json(challenges);
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const totalProfessionals = await User.countDocuments({ role: 'professional' });
        const totalEmployers = await User.countDocuments({ role: 'employer' });
        const totalVerified = await User.countDocuments({ isVerified: true, role: 'professional' });
        const totalPending = await Application.countDocuments({ status: 'pending' });
        const totalChallenges = await Challenge.countDocuments();
        const totalBadges = await Badge.countDocuments();

        res.json({
            totalUsers,
            totalProfessionals,
            totalEmployers,
            totalVerified,
            totalPending,
            totalChallenges,
            totalBadges,
        });
    } catch (error) {
        next(error);
    }
};
