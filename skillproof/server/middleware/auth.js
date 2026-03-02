const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user?.role === 'admin') return next();
    return res.status(403).json({ message: 'Access denied. Admins only.' });
};

const roleMiddleware = (role) => (req, res, next) => {
    if (req.user?.role === role || req.user?.role === 'admin') return next();
    return res.status(403).json({ message: `Access denied. ${role} role required.` });
};

module.exports = { authMiddleware, adminMiddleware, roleMiddleware };
