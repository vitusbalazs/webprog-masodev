import express from 'express';
import path from 'path';
import morgan from 'morgan';
import eformidable from 'express-formidable';
import fs from 'fs';

// a mappa ahonnan statikus tartalmat szolgálunk
const staticDir = path.join(process.cwd(), 'static');

// inicializáljuk az express alkalmazást
const app = express();

// morgan middleware: loggolja a beérkezett hívásokat
app.use(morgan('tiny'));
// express static middleware: statikus állományokat szolgál fel
app.use(express.static(staticDir));

// FORM VALIDATION

const hirdetesek = [
    [1, 'Libertatii 9', 'Kézdivásárhely', 15, 5, 5, new Date('04/02/2022')],
    [2, 'Libertatii 9', 'Kézdivásárhely', 15, 15, 5, new Date('04/02/2022')],
    [3, 'Libertatii 9', 'Kézdivásárhely', 15, 25, 5, new Date('04/02/2022')],
    [4, 'Libertatii 9', 'Kézdivásárhely', 15, 45, 5, new Date('04/02/2022')],
    [5, 'Libertatii 9', 'Kézdivásárhely', 15, 6, 5, new Date('04/02/2022')],
    [6, 'Libertatii 9', 'Kézdivásárhely', 15, 35, 5, new Date('04/02/2022')],
];
const photos = [];

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

    const advID = hirdetesek.length + 1;
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
        const hirdetes = [advID, cim, telepules, felszin, ar, szobak, datum];
        hirdetesek.push(hirdetes);

        res.end(`Your announcement ID is: ${advID}`);
    }
});

app.post('/submitPhoto', (req, res) => {
    res.set('Content-Type', 'text/plain;charset=utf-8');

    const fileHandler = req.files.Fenykep;
    const photoID = req.fields.FenykepID;

    if (photoID > hirdetesek.length) {
        res.statusCode = 400;
        res.end(`No advertisment with this ID: ${photoID}`);
    } else {
        const newPhoto = [photoID, fileHandler];
        photos.push(newPhoto);

        fs.copyFile(fileHandler.path, path.join(process.cwd(), 'uploaded', fileHandler.name), (err) => {
            if (err) {
                console.log('Error Found:', err);
            }
        });

        res.end(`The photo has been uploaded successfully to Advertisment ID: ${photoID}`);
    }
});

app.post('/search', (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    const telepules = req.fields.Telepules;
    const minAr = req.fields.MinAr;
    const maxAr = req.fields.MaxAr;

    let found = 'These advertisments fit your criteria:\n';
    let atLeastOne = false;
    hirdetesek.forEach((adv) => {
        if (adv[4] >= minAr && adv[4] <= maxAr && adv[2] === telepules) {
            if (!atLeastOne) {
                atLeastOne = true;
            }
            found += `ID: ${adv[0]}, Address: ${adv[1]}, Location: ${adv[2]}, Surface area: ${adv[3]}, Price: ${adv[4]}, Number of rooms: ${adv[5]}, Date published: ${adv[6]}\n`;
        }
    });

    if (atLeastOne) {
        res.end(found);
    } else {
        res.statusCode = 400;
        res.end('No advertisments fit your criteria!');
    }
});

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
