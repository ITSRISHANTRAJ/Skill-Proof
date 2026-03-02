const Application = require('../models/Application');
const Badge = require('../models/Badge');
const User = require('../models/User');

// POST /api/professional/apply
exports.apply = async (req, res, next) => {
    try {
        const { portfolioUrl, skillDomain, experience, bio } = req.body;

        if (!portfolioUrl || !skillDomain) {
            return res.status(400).json({ message: 'Portfolio URL and skill domain are required' });
        }

        // Only allow one active (pending or approved) application
        const existing = await Application.findOne({
            user: req.user.id,
            status: { $in: ['pending', 'approved'] }
        });

        if (existing) {
            return res.status(400).json({
                message: `You already have a ${existing.status} application. You cannot submit another.`
            });
        }

        const application = await Application.create({
            user: req.user.id,
            portfolioUrl,
            skillDomain,
            experience: experience || 'mid',
            bio: bio || '',
        });

        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        next(error);
    }
};

// GET /api/professional/dashboard
exports.getDashboard = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const applications = await Application.find({ user: req.user.id }).sort({ createdAt: -1 });
        const badge = await Badge.findOne({ professional: req.user.id }).populate('issuedBy', 'name');

        res.json({
            user,
            applications,
            badge: badge || null,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/professional/badge
exports.getBadge = async (req, res, next) => {
    try {
        const badge = await Badge.findOne({ professional: req.user.id })
            .populate('professional', 'name email')
            .populate('issuedBy', 'name');

        if (!badge) {
            return res.status(404).json({ message: 'No badge found. Verification not yet approved.' });
        }

        res.json(badge);
    } catch (error) {
        next(error);
    }
};
