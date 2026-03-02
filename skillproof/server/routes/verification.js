const express = require('express');
const Application = require('../models/Application');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/apply', authMiddleware, async (req, res) => {
    try {
        const { portfolioUrl, skillDomain } = req.body;

        // Check if user already has a pending or approved application
        const existing = await Application.findOne({ user: req.user.id, status: { $in: ['pending', 'approved'] } });
        if (existing) {
            return res.status(400).json({ message: 'Application already exists' });
        }

        const application = new Application({
            user: req.user.id,
            portfolioUrl,
            skillDomain
        });

        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/my-application', authMiddleware, async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/all', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const applications = await Application.find().populate('user', 'name email isVerified');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/approve/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { technical = 0, communication = 0, impact = 0 } = req.body;
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const averageScore = Math.round((Number(technical) + Number(communication) + Number(impact)) / 3);

        application.status = 'approved';
        application.scoreBreakdown = { technical, communication, impact };
        application.badgeMetadata = {
            score: averageScore,
            issuedAt: new Date(),
            skill: application.skillDomain,
            verificationId: `VER-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        };
        application.reviewedBy = req.user.id;
        application.reviewedAt = new Date();

        await application.save();

        const user = await User.findById(application.user);
        if (user) {
            user.isVerified = true;
            await user.save();
        }

        res.json({ message: 'Application approved successfully', application });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* Public: Get verified professionals for employer dashboard */
router.get('/verified-professionals', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const users = await User.find({ isVerified: true, role: 'professional' })
            .select('-password')
            .limit(limit);

        // Optionally we could join with their approved application to show their skill domain/portfolio,
        // let's fetch those too. Include badge data now.
        const results = await Promise.all(users.map(async (u) => {
            const app = await Application.findOne({ user: u._id, status: 'approved' });
            return {
                ...u.toObject(),
                skillDomain: app?.skillDomain,
                portfolioUrl: app?.portfolioUrl,
                badgeMetadata: app?.badgeMetadata || null
            };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
