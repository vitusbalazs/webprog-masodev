import Router from 'express';
import bcrypt from 'bcrypt';
import { insertUser, userExists } from '../db/userDB.js';

const router = new Router();

router.get('/login', (req, res) => {
    res.type('.html');
    res.render('login', { errMsg: '' });
});

router.get('/register', (req, res) => {
    res.type('.html');
    res.render('register', { errMsg: '', successMsg: '' });
});

router.post('/register', async (req, res) => {
    res.type('.html');
    try {
        const username = req.fields.rUsername;
        if (await userExists(username)) {
            res.render('register', { errMsg: 'There is already a user registered with this username. Please choose another one.', successMsg: '' });
        } else {
            const password = req.fields.rPassword;
            const passwordHashed = bcrypt.hashSync(password, 10);

            await insertUser(username, passwordHashed);
            res.render('register', { errMsg: '', successMsg: 'You have successfully registered!' });
        }
    } catch (err) {
        res.render('register', { errMsg: 'There was an error while registering', successMsg: '' });
    }
});

export default router;
