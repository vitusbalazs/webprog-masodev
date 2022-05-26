import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userExists, insertUser, getUserByName } from '../db/usersDB.js';
import secret from '../auth/secret.js';
import { getCurrentUser } from '../auth/middleware.js';

const router = Router();

router.get('/register', async (req, res) => {
    const currentUser = getCurrentUser(req);

    res.type('.html');
    res.render('regisztracio', { error: '', username: currentUser });
});

router.use('/logout', async (req, res) => {
    try {
        res.clearCookie('auth');
        res.redirect('/');
    } catch (err) {
        res.status(500);
        res.send('Szerver hiba logout közben');
    }
});

router.post('/loginUser', async (req, res) => {
    const username = req.fields.loginFelhasznalo;
    const password = req.fields.loginJelszo;

    try {
        const currentUser = getCurrentUser(req);

        if (currentUser === 'Not logged in') {
            const userFromDB = await getUserByName(username);
            if (username === userFromDB.Nev && bcrypt.compareSync(password, userFromDB.Jelszo)) {
                const token = jwt.sign({ name: username }, secret);
                res.cookie('auth', token, { httpOnly: true, sameSite: 'strict' });
                res.redirect('/');
            } else {
                res.status(401);
                res.send('Login unsuccessful');
            }
        } else {
            res.type('.html');
            res.render('login', { error: 'Már be vagy jelentkezve. Előbb jelentkezz ki!', username: currentUser });
        }
    } catch (err) {
        console.error(err);
        res.status(400);
        res.send('Adj meg egy valid felhasználónevet és egy jelszót');
    }
});

router.get('/', async (req, res) => {
    const currentUser = getCurrentUser(req);

    res.type('.html');
    res.render('login', { error: '', username: currentUser });
});

router.post('/newUser', async (req, res) => {
    const username = req.fields.Username;
    const password = req.fields.UserPassword;

    const currentUser = getCurrentUser(req);

    if (currentUser === 'Not logged in') {
        const passwordHashed = bcrypt.hashSync(password, 10);

        if (await userExists(username)) {
            res.type('.html');
            res.render('regisztracio', { error: 'Már létezik felhasználó ezzel a névvel!', username: currentUser });
        } else {
            insertUser(username, passwordHashed).catch((error) => {
                console.error(`MySQL insertion error: ${error}`);
                res.type('.html');
                res.render('mysql_error', { tableName: 'hirdetes', errMess: error });
            });
            res.redirect('/');
        }
    } else {
        res.type('.html');
        res.render('regisztracio', { error: 'Be vagy éppen jelentkezve. Regisztráláshoz előbb jelentkezz ki!', username: currentUser });
    }
});

export default router;
