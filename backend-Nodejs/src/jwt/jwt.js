const jwt = require('jsonwebtoken');
const config = require('./config');

function generateToken(user) {

    const payload = {
        id: user.id,
        email: user.email,
    };

    const token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
    });

    return token;
}


function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        return decoded;
    } catch (error) {
        return null; // Token is invalid
    }
}

module.exports = {
    generateToken,
    verifyToken,
};