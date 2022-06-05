import Router from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import secret from '../auth/secret.js';
import { getCurrentUser } from '../auth/middleware.js';
import {
    getUserFromName, getUsersIndex, insertUser, updateEmail, updatePassword, validateEmail,
} from '../db/connectMongo.js';

function sendEmail(email, subject, text) {
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
        subject,
        text,
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

// Router GET methods

router.get('/', (req, res) => {
    res.send();
});

router.get('/login', (req, res) => {
    const loginName = getCurrentUser(req) || undefined;
    res.type('.html');
    res.render('login', {
        errMsg: '', successMsg: '', loginName, navbarActive: 3,
    });
});

router.get('/register', (req, res) => {
    const loginName = getCurrentUser(req) || undefined;
    res.type('.html');
    res.render('register', {
        errMsg: '', successMsg: '', loginName, navbarActive: 4,
    });
});

router.get('/details', (req, res) => {
    const loginName = getCurrentUser(req) || undefined;
    res.type('.html');
    res.render('userDetails', {
        errMsg: '', successMsg: '', loginName, navbarActive: 5,
    });
});

router.get('/verify', async (req, res) => {
    const loginName = getCurrentUser(req) || undefined;
    try {
        const queryToken = req.query.token;
        console.log(queryToken);
        await validateEmail(queryToken);
        res.type('.html');
        res.render('login', {
            errMsg: '', successMsg: 'E-mail verified successfully! You can now log in.', loginName, navbarActive: 3,
        });
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

// Router POST methods

router.post('/login', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        if (loginName !== undefined) {
            res.render('login', {
                errMsg: 'You are already logged in', successMsg: '', loginName, navbarActive: 3,
            });
        } else {
            const username = req.fields.lUsername;
            const password = req.fields.lPassword;
            const userFromDB = await getUserFromName(username);
            if (userFromDB && username === userFromDB.username) {
                if (bcrypt.compareSync(password, userFromDB.password)) {
                    if (userFromDB.accountVerified) {
                        const token = jwt.sign({ name: username }, secret);
                        res.cookie('auth', token, { httpOnly: true, sameSite: 'strict' });
                        res.render('login', {
                            errMsg: '', successMsg: 'You have successfully logged in.', loginName: username, navbarActive: 3,
                        });
                    } else {
                        res.render('login', {
                            errMsg: 'Your account is not yet verified. Check your emails!', successMsg: '', loginName, navbarActive: 3,
                        });
                    }
                } else {
                    res.render('login', {
                        errMsg: 'Wrong password!', successMsg: '', loginName, navbarActive: 3,
                    });
                }
            } else {
                res.render('login', {
                    errMsg: 'This username does not exist!', successMsg: '', loginName, navbarActive: 3,
                });
            }
        }
    } catch (err) {
        res.render('login', {
            errMsg: 'There was an error while logging you in (Maybe the username you gave doesn\'t exist)', successMsg: '', loginName, navbarActive: 3,
        });
    }
});

router.post('/register', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        if (loginName !== undefined) {
            res.render('register', {
                errMsg: 'You are already logged in. Log out first!', successMsg: '', loginName, navbarActive: 4,
            });
        } else {
            const username = req.fields.rUsername;
            const email = req.fields.rEmail;
            if (await getUserFromName(username)) {
                res.render('register', {
                    errMsg: 'There is already a user registered with this username. Please choose another one.', successMsg: '', loginName, navbarActive: 4,
                });
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
                sendEmail(email, 'Confirm your registration', `Please click here to verify your registration: http://localhost:8080/user/verify?token=${verifyToken}`);

                res.render('register', {
                    errMsg: '', successMsg: 'You have successfully registered! Please log in!', loginName, navbarActive: 4,
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.render('register', {
            errMsg: `There was an error while registering: ${err}`, successMsg: '', loginName, navbarActive: 4,
        });
    }
});

router.post('/changePassword', async (req, res) => {
    const loginName = getCurrentUser(req) || undefined;
    try {
        const oldpw = req.fields.cpOld;
        const newpw1 = req.fields.cpNew;
        const newpw2 = req.fields.cpNew2;
        if (newpw1 === newpw2) {
            const userFromDB = await getUserFromName(loginName);
            if (bcrypt.compareSync(oldpw, userFromDB.password)) {
                const newpwHashed = bcrypt.hashSync(newpw1, 10);
                await updatePassword(userFromDB._id, newpwHashed);
                res.type('.html');
                res.render('userDetails', {
                    errMsg: '', successMsg: 'Password successfully changed!', loginName, navbarActive: 5,
                });
                sendEmail(userFromDB.email, 'Your password has been changed!', 'Your password has been changed. If you don\'t remember changing your password, please contact our customer support or change your password using the \'I forgot my password\' section!');
            } else {
                res.type('.html');
                res.render('userDetails', {
                    errMsg: 'The old password is not matching!', successMsg: '', loginName, navbarActive: 5,
                });
            }
        } else {
            res.type('.html');
            res.render('userDetails', {
                errMsg: 'The new password are not matching!', successMsg: '', loginName, navbarActive: 5,
            });
        }
    } catch (err) {
        res.type('.html');
        res.render('userDetails', {
            errMsg: 'There was an error while trying to change your password.', successMsg: '', loginName, navbarActive: 5,
        });
    }
});

router.post('/changeEmail', async (req, res) => {
    const loginName = getCurrentUser(req) || undefined;
    try {
        const oldemail = req.fields.ceOld;
        const newemail = req.fields.ceNew;
        const userFromDB = await getUserFromName(loginName);
        if (oldemail === userFromDB.email) {
            await updateEmail(userFromDB._id, newemail);
            sendEmail(userFromDB.email, 'Your e-mail address has been changed!', `Your e-mail address has been changed to ${newemail}. If you don't remember changing your e-mail, please contatct our customer support or change your password and e-mail immediatelly!`);
            res.type('.html');
            res.render('userDetails', {
                errMsg: '', successMsg: 'E-mail address successfully changed!', loginName, navbarActive: 5,
            });
        } else {
            res.type('.html');
            res.render('userDetails', {
                errMsg: 'The old e-mail address is not matching!', successMsg: '', loginName, navbarActive: 5,
            });
        }
    } catch (err) {
        res.type('.html');
        res.render('userDetails', {
            errMsg: 'There was an error while trying to change your e-mail address.', successMsg: '', loginName, navbarActive: 5,
        });
    }
});

export default router;
