import express from 'express';
import path from 'path';
import morgan from 'morgan';
import eformidable from 'express-formidable';
import fs from 'fs';
import {
    getAdvertisments, insertAdvertisment, getDetails, getPhotos,
    insertPhoto, getUsers, insertUser, userExists,
} from './db/db.js';

// a mappa ahonnan statikus tartalmat szolgálunk
const staticDir = path.join(process.cwd(), 'static');

// inicializáljuk az express alkalmazást
const app = express();

// morgan middleware: loggolja a beérkezett hívásokat
app.use(morgan('tiny'));

// formidable-lel dolgozzuk fel a kéréseket
app.use(eformidable({ staticDir }));
app.set('view engine', 'ejs');

function validateDate(date1, date2) {
    if (date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
        if (date1.getFullYear() === date2.getFullYear()) {
            return true;
        }
    }
    return false;
}

function validateNew(cim, telepules, felszin, ar, szobak) {
    if (cim.length < 3) {
        return false;
    }
    if (telepules.length < 3) {
        return false;
    }
    if (felszin <= 0) {
        return false;
    }
    if (ar < 0) {
        return false;
    }
    if (szobak <= 0) {
        return false;
    }
    return true;
}

function validateLength(cim, telepules) { // complexity miatt
    if (cim.length < 3 || telepules.length < 3) {
        return false;
    }
    return true;
}

app.post('/submitNew', async (req, res) => {
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
        console.log(users);
        res.type('.html');
        res.render('hirdetes', { felhasznalok: users, errors: errorString });
    } else {
        insertAdvertisment(cim, telepules, felszin, ar, szobak, datum, user).catch((error) => {
            console.error(`MySQL insertion error: ${error}`);
            res.type('.html');
            res.render('mysql_error', { tableName: 'hirdetes', errMess: error });
        });
        res.redirect('/');
    }
});

app.post('/newUser', async (req, res) => {
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

app.post('/search', async (req, res) => {
    const telepules = req.fields.Telepules;
    const minAr = req.fields.MinAr;
    const maxAr = req.fields.MaxAr;

    try {
        const adv = await getAdvertisments(true, telepules, minAr, maxAr);
        res.type('.html');
        res.render('listazas', { hirdetesek: adv, error: '' });
    } catch (err) {
        console.error(err);
        res.type('.html');
        res.render('listazas', { hirdetesek: [], error: 'Hiba történt az SQL lekérés és a listázás közben.' });
    }
});

app.get(['/hirdetes.html', '/ad/hirdetes.html'], async (req, res) => {
    const users = await getUsers();
    res.type('.html');
    res.render('hirdetes', { felhasznalok: users, errors: '' });
});

app.get('/ad/main.css', (req, res) => {
    res.redirect('/main.css');
});

app.get('/ad/:adID', async (req, res) => {
    const ad = req.params.adID;
    const advertisments = await getDetails(ad);
    const photos = await getPhotos(ad);

    res.type('.html');
    res.render('reszletek', { hirdetesek: advertisments, fotok: photos });
});

app.post('/submitPhoto/:advID', async (req, res) => {
    const fileHandler = req.files.Fenykep;
    const photoID = req.params.advID;

    const absolutePathToUploadDirectory = path.join(process.cwd(), 'static', 'uploaded', fileHandler.name);
    fs.copyFile(fileHandler.path, absolutePathToUploadDirectory, (err) => {
        if (err) {
            console.log('Error Found:', err);
        }
    });

    const absolutePathToStoreFromRepoDir = path.join('/uploaded', fileHandler.name);

    insertPhoto(photoID, absolutePathToStoreFromRepoDir).catch((error) => {
        console.error(`MySQL insertion error: ${error}`);
        res.type('.html');
        res.render('mysql_error', { tableName: 'fenykep', errMess: error });
    });

    res.redirect(`/ad/${photoID}`);
});

app.get('/', async (req, res) => {
    const adv = await getAdvertisments(false);
    res.type('.html');
    res.render('listazas', { hirdetesek: adv });
});

// express static middleware: statikus állományokat szolgál fel
app.use(express.static(staticDir));

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
