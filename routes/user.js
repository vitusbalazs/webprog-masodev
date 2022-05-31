import Router from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import secret from '../auth/secret.js';
import { getUserFromName, insertUser, userExists } from '../db/userDB.js';
import { getCurrentUser } from '../auth/middleware.js';

const router = new Router();

router.get('/login', (req, res) => {
    const loginName = getCurrentUser(req) || 'Not logged in';
    res.type('.html');
    res.render('login', { errMsg: '', successMsg: '', loginName });
});

router.get('/register', (req, res) => {
    const loginName = getCurrentUser(req) || 'Not logged in';
    res.type('.html');
    res.render('register', { errMsg: '', successMsg: '', loginName });
});

router.post('/login', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || 'Not logged in';
    try {
        if (loginName !== 'Not logged in') {
            res.render('login', { errMsg: 'You are already logged in', successMsg: '', loginName });
        } else {
            const username = req.fields.lUsername;
            const password = req.fields.lPassword;
            const userFromDB = await getUserFromName(username);
            if (username === userFromDB.Name && bcrypt.compareSync(password, userFromDB.Password)) {
                const token = jwt.sign({ name: username }, secret);
                res.cookie('auth', token, { httpOnly: true, sameSite: 'strict' });
                res.render('login', { errMsg: '', successMsg: 'You have successfully logged in.', loginName: username });
            } else {
                res.render('login', { errMsg: 'There was an error while logging you in (Maybe the username you gave doesn\'t exist)', successMsg: '', loginName });
            }
        }
    } catch (err) {
        res.render('login', { errMsg: 'There was an error while logging you in (Maybe the username you gave doesn\'t exist)', successMsg: '', loginName });
    }
});

router.post('/register', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || 'Not logged in';
    try {
        if (loginName !== 'Not logged in') {
            res.render('register', { errMsg: 'You are already logged in. Log out first!', successMsg: '', loginName });
        } else {
            const username = req.fields.rUsername;
            if (await userExists(username)) {
                res.render('register', { errMsg: 'There is already a user registered with this username. Please choose another one.', successMsg: '', loginName });
            } else {
                const password = req.fields.rPassword;
                const passwordHashed = bcrypt.hashSync(password, 10);

                await insertUser(username, passwordHashed);
                res.render('register', { errMsg: '', successMsg: 'You have successfully registered! Please log in!', loginName });
            }
        }
    } catch (err) {
        res.render('register', { errMsg: 'There was an error while registering', successMsg: '', loginName });
    }
});

router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('auth');
        res.redirect('/');
    } catch (err) {
        res.status(500);
        res.send('Can\'t log you out at the moment');
    }
});

export default router;
