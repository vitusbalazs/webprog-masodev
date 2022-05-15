import { Router } from 'express';
import { getUsers } from '../db/usersDB.js';
import { insertAdvertisment } from '../db/advertismentsDB.js';
import { validateDate, validateLength, validateNew } from './newRecordValidation.js';

const router = Router();

router.get('/', async (req, res) => {
    const users = await getUsers();
    res.type('.html');
    res.render('hirdetes', { felhasznalok: users, errors: '' });
});

router.post('/submitNew', async (req, res) => {
    const cim = req.fields.Cim;
    const telepules = req.fields.Telepules;
    const felszin = req.fields.Felszinterulet;
    const ar = req.fields.Ar;
    const szobak = req.fields.SzobakSzama;
    const datum = new Date(req.fields.Datum);
    const user = req.fields.Felhasznalo;

    if (!validateNew(cim, telepules, felszin, ar, szobak) || !validateDate(datum, new Date())) {
        let errorString = 'A következő hibák léptek fel: ';
        if (!validateLength(cim, telepules)) {
            errorString += 'A cím vagy a település túl rövid, ';
        }
        if (felszin <= 0 || ar <= 0 || szobak <= 0) {
            errorString += 'A felszin, az ar es a szobak szama nem lehet 0 vagy kisebb, ';
        }
        if (!validateDate(datum, new Date())) {
            errorString += 'A dátum a mai dátum kell legyen!';
        }

        const users = await getUsers();
        res.type('.html');
        res.render('hirdetes', { felhasznalok: users, errors: errorString });
    } else {
        await insertAdvertisment(cim, telepules, felszin, ar, szobak, datum, user)
            .catch((error) => {
                console.error(`MySQL insertion error: ${error}`);
                res.type('.html');
                res.render('mysql_error', { tableName: 'hirdetes', errMess: error });
            });
        res.redirect('/');
    }
});

export default router;
