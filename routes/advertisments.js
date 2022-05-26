import { Router } from 'express';
import { getUserByName } from '../db/usersDB.js';
import { insertAdvertisment } from '../db/advertismentsDB.js';
import { validateLength, validateNew } from './newRecordValidation.js';
import { getCurrentUser, validateJWT } from '../auth/middleware.js';

const router = Router();

router.use('/', validateJWT);

router.get('/', async (req, res) => {
    const currentUser = getCurrentUser(req);
    const users = await getUserByName(currentUser);
    res.type('.html');
    res.render('hirdetes', { felhasznalo: users, errors: '', username: currentUser });
});

router.post('/submitNew', async (req, res) => {
    const cim = req.fields.Cim;
    const telepules = req.fields.Telepules;
    const felszin = req.fields.Felszinterulet;
    const ar = req.fields.Ar;
    const szobak = req.fields.SzobakSzama;
    const datum = new Date(req.fields.Datum);
    const user = req.fields.Felhasznalo;

    if (!validateNew(cim, telepules, felszin, ar, szobak)) {
        let errorString = 'A következő hibák léptek fel: ';
        if (!validateLength(cim, telepules)) {
            errorString += 'A cím vagy a település túl rövid, ';
        }
        if (felszin <= 0 || ar <= 0 || szobak <= 0) {
            errorString += 'A felszin, az ar es a szobak szama nem lehet 0 vagy kisebb, ';
        }

        const currentUser = getCurrentUser(req);
        const users = await getUserByName(currentUser);
        res.type('.html');
        res.render('hirdetes', { felhasznalo: users, errors: errorString, username: currentUser });
    } else {
        try {
            await insertAdvertisment(cim, telepules, felszin, ar, szobak, datum, user);
        } catch (error) {
            console.error(`MySQL insertion error: ${error}`);
            res.type('.html');
            res.render('mysql_error', { tableName: 'hirdetes', errMess: error });
        }
        res.redirect('/');
    }
});

export default router;
