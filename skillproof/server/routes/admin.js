const express = require('express');
const router = express.Router();
const {
    getPendingApplications,
    approveApplication,
    rejectApplication,
    createChallenge,
    getChallenges,
    getStats,
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const isAdmin = [authMiddleware, adminMiddleware];

// GET /api/admin/stats
router.get('/stats', isAdmin, getStats);

// GET /api/admin/pending-applications  (supports ?status=pending|approved|rejected|all)
router.get('/pending-applications', isAdmin, getPendingApplications);

// POST /api/admin/approve/:id
router.post('/approve/:id', isAdmin, approveApplication);

// POST /api/admin/reject/:id
router.post('/reject/:id', isAdmin, rejectApplication);

// POST /api/admin/create-challenge
router.post('/create-challenge', isAdmin, createChallenge);

// GET /api/admin/challenges
router.get('/challenges', isAdmin, getChallenges);

module.exports = router;
