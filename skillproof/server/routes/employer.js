const express = require('express');
const router = express.Router();
const {
    getDashboard,
    getVerifiedProfessionals,
    getProfessionalById,
} = require('../controllers/employerController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const isEmployer = [authMiddleware, roleMiddleware('employer')];

// GET /api/employer/dashboard
router.get('/dashboard', isEmployer, getDashboard);

// GET /api/employer/verified-professionals  (can also be accessed publicly for browsing)
router.get('/verified-professionals', authMiddleware, getVerifiedProfessionals);

// GET /api/employer/professional/:id
router.get('/professional/:id', authMiddleware, getProfessionalById);

module.exports = router;
