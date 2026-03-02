const User = require('../models/User');
const Application = require('../models/Application');
const Badge = require('../models/Badge');

// GET /api/employer/dashboard
exports.getDashboard = async (req, res, next) => {
    try {
        const totalVerified = await User.countDocuments({ isVerified: true, role: 'professional' });
        const recentProfessionals = await User.find({ isVerified: true, role: 'professional' })
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(6);

        // Enrich with skill domain from their approved application
        const enriched = await Promise.all(recentProfessionals.map(async (u) => {
            const app = await Application.findOne({ user: u._id, status: 'approved' });
            const badge = await Badge.findOne({ professional: u._id });
            return {
                ...u.toObject(),
                skillDomain: app?.skillDomain || '',
                portfolioUrl: app?.portfolioUrl || u.portfolioUrl || '',
                badgeCode: badge?.badgeCode || null,
            };
        }));

        res.json({ totalVerified, recentProfessionals: enriched });
    } catch (error) {
        next(error);
    }
};

// GET /api/employer/verified-professionals
exports.getVerifiedProfessionals = async (req, res, next) => {
    try {
        const { skill, search } = req.query;

        const professionalUsers = await User.find({ isVerified: true, role: 'professional' })
            .select('-password')
            .sort({ createdAt: -1 });

        let results = await Promise.all(professionalUsers.map(async (u) => {
            const app = await Application.findOne({ user: u._id, status: 'approved' });
            const badge = await Badge.findOne({ professional: u._id });
            return {
                ...u.toObject(),
                skillDomain: app?.skillDomain || '',
                experience: app?.experience || '',
                portfolioUrl: app?.portfolioUrl || u.portfolioUrl || '',
                badgeCode: badge?.badgeCode || null,
            };
        }));

        // Filter by skill domain
        if (skill) {
            results = results.filter(p =>
                p.skillDomain.toLowerCase().includes(skill.toLowerCase())
            );
        }

        // Filter by search (name or skill)
        if (search) {
            results = results.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.skillDomain.toLowerCase().includes(search.toLowerCase())
            );
        }

        res.json(results);
    } catch (error) {
        next(error);
    }
};

// GET /api/employer/professional/:id
exports.getProfessionalById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user || user.role !== 'professional') {
            return res.status(404).json({ message: 'Professional not found' });
        }

        const application = await Application.findOne({ user: user._id, status: 'approved' });
        const badge = await Badge.findOne({ professional: user._id }).populate('issuedBy', 'name');

        res.json({
            ...user.toObject(),
            skillDomain: application?.skillDomain || '',
            experience: application?.experience || '',
            portfolioUrl: application?.portfolioUrl || user.portfolioUrl || '',
            bio: application?.bio || user.bio || '',
            badge: badge || null,
        });
    } catch (error) {
        next(error);
    }
};
