import jwt from 'jsonwebtoken';
import secret from './secret.js';

export function validateJWT(req, res, next) {
    if (!req.cookies.auth) {
        res.status(401);
        res.type('.html');
        res.render('login', {
            errMsg: 'You need to log in first!', successMsg: '', loginName: undefined, navbarActive: 3,
        });
    } else {
        try {
            jwt.verify(req.cookies.auth, secret);
            next();
        } catch (err) {
            console.error(err);
            res.status(401);
            res.type('.html');
            res.render('login', {
                errMsg: 'JWT token not valid. Please re-login!', successMsg: '', loginName: undefined, navbarActive: 3,
            });
        }
    }
}

export function getCurrentUser(req) {
    if (req.cookies.auth) {
        const currentUser = jwt.verify(req.cookies.auth, secret);
        return currentUser.name;
    }
    return undefined;
}
