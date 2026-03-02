require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const professionalRoutes = require('./routes/professional');
const employerRoutes = require('./routes/employer');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');

const app = express();

if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL ERROR: JWT_SECRET is not defined.');
    process.exit(1);
}

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(helmet());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/professional', professionalRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'SkillProof API', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Global error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillproof')
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        await createDefaultAdmin();
        app.listen(PORT, () => {
            console.log(`🚀 SkillProof API running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

async function createDefaultAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@skillproof.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
        const hashed = await bcrypt.hash(adminPassword, 12);
        await User.create({
            name: 'SkillProof Admin',
            email: adminEmail,
            password: hashed,
            role: 'admin',
            isVerified: true,
        });
        console.log(`👤 Default admin created: ${adminEmail} / ${adminPassword}`);
    }
}
