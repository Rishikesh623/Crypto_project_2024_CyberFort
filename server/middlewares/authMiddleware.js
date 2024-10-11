const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

const authMiddleware = (req, res, next) => {
    const cookieHeader = req.headers.cookie; // get cookie from the headers

    if (!cookieHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Split and find the token value from cookies
    const token = cookieHeader.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; //attach the decoded user id to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { authMiddleware };
