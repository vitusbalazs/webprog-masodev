import express from 'express';
import path from 'path';
import morgan from 'morgan';
import eformidable from 'express-formidable';
import fs from 'fs';
import {
    getAdvertisments, insertAdvertisment, getDetails, getPhotos, advertismentExists, insertPhoto,
} from './db.js';

// a mappa ahonnan statikus tartalmat szolgálunk
const staticDir = path.join(process.cwd(), 'static');

// inicializáljuk az express alkalmazást
const app = express();

// morgan middleware: loggolja a beérkezett hívásokat
app.use(morgan('tiny'));
// express static middleware: statikus állományokat szolgál fel
app.use(express.static(staticDir));

// FORM VALIDATION

// formidable-lel dolgozzuk fel a kéréseket
app.use(eformidable({ staticDir }));

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

app.post('/submitNew', (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');

    const cim = req.fields.Cim;
    const telepules = req.fields.Telepules;
    const felszin = req.fields.Felszinterulet;
    const ar = req.fields.Ar;
    const szobak = req.fields.SzobakSzama;
    const datum = new Date(req.fields.Datum);

    if (!validateNew(cim, telepules, felszin, ar, szobak) || !validateDate(datum, new Date())) {
        res.statusCode = 400;
        res.end('Hibás adatokat adtál meg!');
    } else {
        insertAdvertisment(cim, telepules, felszin, ar, szobak, datum).catch((error) => {
            console.error(`MySQL insertion error: ${error}`);
        });
    }

    res.redirect('/');
});

app.post('/submitPhoto', async (req, res) => {
    res.set('Content-Type', 'text/plain;charset=utf-8');

    const fileHandler = req.files.Fenykep;
    const photoID = req.fields.FenykepID;

    const adv = await advertismentExists(photoID);

    if (!adv) { // ellenorzest atirni
        res.statusCode = 400;
        res.end(`No advertisment with this ID: ${photoID}`);
    } else {
        const newFileName = path.join(process.cwd(), 'static', 'uploaded', fileHandler.name);
        fs.copyFile(fileHandler.path, newFileName, (err) => {
            if (err) {
                console.log('Error Found:', err);
            }
        });

        // const newFileName2 = path.join('static', 'uploaded', fileHandler.name);
        const newFileName2 = `../uploaded/${fileHandler.name}`;

        insertPhoto(photoID, newFileName2).catch((error) => {
            console.error(`MySQL insertion error: ${error}`);
        });

        res.redirect(`/ad/${photoID}`);
    }
});

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });

app.set('view engine', 'ejs');
app.post('/search', async (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    const telepules = req.fields.Telepules;
    const minAr = req.fields.MinAr;
    const maxAr = req.fields.MaxAr;

    try {
        const adv = await getAdvertisments(true, telepules, minAr, maxAr);
        res.type('.html');
        res.render('listazas', { hirdetesek: adv[0] });
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(`Error: ${err}`);
    }
});

app.get('/', async (req, res) => {
    const adv = await getAdvertisments(false);
    res.type('.html');
    res.render('listazas', { hirdetesek: adv[0] });
});

app.get('/ad/hirdetes.html', (req, res) => {
    res.redirect('/hirdetes.html');
});

app.get('/ad/main.css', (req, res) => {
    res.redirect('/main.css');
});

app.get('/ad/:adID', async (req, res) => {
    const ad = req.params.adID;
    const adv = await getDetails(ad);
    const adv2 = await getPhotos(ad);

    res.type('.html');
    res.render('reszletek', { hirdetesek: adv[0], fotok: adv2[0] });
});