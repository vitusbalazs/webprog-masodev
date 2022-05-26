import jwt from 'jsonwebtoken';
import secret from './secret.js';

export function validateJWT(req, res, next) {
    if (!req.cookies.auth) {
        res.status(401);
        res.send('You need to log in first.');
    } else {
        try {
            jwt.verify(req.cookies.auth, secret);
            next();
        } catch (err) {
            console.error(err);
            res.clearCookie('auth');
            res.status(401);
            res.send('JWT token not valid. Please re-login.');
        }
    }
}

export function getCurrentUser(req) {
    if (req.cookies.auth) {
        const currentUser = jwt.verify(req.cookies.auth, secret);
        return currentUser.name;
    }
    return 'Not logged in';
}
