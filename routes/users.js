import { Router } from 'express';
import { userExists, insertUser } from '../db/usersDB.js';

const router = Router();

router.get('/', async (req, res) => {
    res.type('.html');
    res.render('regisztracio', { error: '' });
});

router.post('/newUser', async (req, res) => {
    const username = req.fields.Username;
    const password = req.fields.UserPassword;

    if (await userExists(username)) {
        res.type('.html');
        res.render('regisztracio', { error: 'Már létezik felhasználó ezzel a névvel!' });
    } else {
        insertUser(username, password).catch((error) => {
            console.error(`MySQL insertion error: ${error}`);
            res.type('.html');
            res.render('mysql_error', { tableName: 'hirdetes', errMess: error });
        });
        res.redirect('/');
    }
});

export default router;
