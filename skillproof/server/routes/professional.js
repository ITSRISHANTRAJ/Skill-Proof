const express = require('express');
const router = express.Router();
const { apply, getDashboard, getBadge } = require('../controllers/professionalController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const isProfessional = [authMiddleware, roleMiddleware('professional')];

// POST /api/professional/apply
router.post('/apply', isProfessional, apply);

// GET /api/professional/dashboard
router.get('/dashboard', isProfessional, getDashboard);

// GET /api/professional/badge
router.get('/badge', isProfessional, getBadge);

module.exports = router;
