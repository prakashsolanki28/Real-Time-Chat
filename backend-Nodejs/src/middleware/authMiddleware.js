const { verifyToken } = require('../jwt/jwt');

function authenticateJWT(req, res, next) {

    const excludedRoutes = ['/login', '/register', '/temp', '/socket.io'];
    if (excludedRoutes.includes(req.path)) {
        return next();
    }

    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
}

module.exports = authenticateJWT;
