import Router from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import secret from '../auth/secret.js';
import { getCurrentUser } from '../auth/middleware.js';
import {
    getUserFromName, getUsersIndex, insertUser, validateEmail,
} from '../db/connectMongo.js';

function sendEmail(email, verifyToken) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'vitusb01@gmail.com',
            pass: 'dfthchxxwnfquyuk',
        },
    });
    const mailOptions = {
        from: 'vitusb01@gmail.com',
        to: email,
        subject: 'Confirm your registration',
        text: `Please click here to verify your registration: http://localhost:8080/user/verify?token=${verifyToken}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
}

const router = new Router();

router.get('/', (req, res) => {
    res.send();
});

router.get('/login', (req, res) => {
    const loginName = getCurrentUser(req) || undefined;
    res.type('.html');
    res.render('login', { errMsg: '', successMsg: '', loginName });
});

router.get('/register', (req, res) => {
    const loginName = getCurrentUser(req) || undefined;
    res.type('.html');
    res.render('register', { errMsg: '', successMsg: '', loginName });
});

router.post('/login', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        if (loginName !== undefined) {
            res.render('login', { errMsg: 'You are already logged in', successMsg: '', loginName });
        } else {
            const username = req.fields.lUsername;
            const password = req.fields.lPassword;
            const userFromDB = await getUserFromName(username);
            if (userFromDB && username === userFromDB.username) {
                if (bcrypt.compareSync(password, userFromDB.password)) {
                    if (userFromDB.accountVerified) {
                        const token = jwt.sign({ name: username }, secret);
                        res.cookie('auth', token, { httpOnly: true, sameSite: 'strict' });
                        res.render('login', { errMsg: '', successMsg: 'You have successfully logged in.', loginName: username });
                    } else {
                        res.render('login', { errMsg: 'Your account is not yet verified. Check your emails!', successMsg: '', loginName });
                    }
                } else {
                    res.render('login', { errMsg: 'Wrong password!', successMsg: '', loginName });
                }
            } else {
                res.render('login', { errMsg: 'This username does not exist!', successMsg: '', loginName });
            }
        }
    } catch (err) {
        res.render('login', { errMsg: 'There was an error while logging you in (Maybe the username you gave doesn\'t exist)', successMsg: '', loginName });
    }
});

router.post('/register', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        if (loginName !== undefined) {
            res.render('register', { errMsg: 'You are already logged in. Log out first!', successMsg: '', loginName });
        } else {
            const username = req.fields.rUsername;
            const email = req.fields.rEmail;
            if (await getUserFromName(username)) {
                res.render('register', { errMsg: 'There is already a user registered with this username. Please choose another one.', successMsg: '', loginName });
            } else {
                const password = req.fields.rPassword;
                const passwordHashed = bcrypt.hashSync(password, 10);

                const lastUserIndex = await getUsersIndex();

                const verifyToken = bcrypt.hashSync(toString(lastUserIndex), 10);

                const userData = {
                    _id: lastUserIndex,
                    username,
                    password: passwordHashed,
                    email,
                    role: 'user',
                    accountVerified: 0,
                    verifyToken,
                };

                await insertUser(userData);
                sendEmail(email, verifyToken);

                res.render('register', { errMsg: '', successMsg: 'You have successfully registered! Please log in!', loginName });
            }
        }
    } catch (err) {
        console.log(err);
        res.render('register', { errMsg: `There was an error while registering: ${err}`, successMsg: '', loginName });
    }
});

router.get('/verify', async (req, res) => {
    try {
        const queryToken = req.query.token;
        console.log(queryToken);
        await validateEmail(queryToken);
        res.redirect('/user/login');
    } catch (err) {
        res.status(500);
        res.send('Can\'t verify the e-mail right now.');
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
