import express from 'express';
import path from 'path';
import morgan from 'morgan';
import eformidable from 'express-formidable'

// a mappa ahonnan statikus tartalmat szolgálunk
// process.cwd() - globális változó, az aktuális katalógusra mutat a szerveren
// SOSE a gyökeret tegyünk publikussá
const staticDir = path.join(process.cwd(), 'static');

// inicializáljuk az express alkalmazást
const app = express();

// morgan middleware: loggolja a beérkezett hívásokat
app.use(morgan('tiny'));
// express static middleware: statikus állományokat szolgál fel
app.use(express.static(staticDir));


// FORM VALIDATION

let hirdetesek = [
    [1,"Libertatii 9","Kézdivásárhely",15,5,5,new Date("04/02/2022")],
    [2,"Libertatii 9","Kézdivásárhely",15,15,5,new Date("04/02/2022")],
    [3,"Libertatii 9","Kézdivásárhely",15,25,5,new Date("04/02/2022")],
    [4,"Libertatii 9","Kézdivásárhely",15,45,5,new Date("04/02/2022")],
    [5,"Libertatii 9","Sepsiszentgyörgy",15,6,5,new Date("04/02/2022")],
    [6,"Libertatii 9","Kézdivásárhely",15,35,5,new Date("04/02/2022")]
];
let photos = [];

// standard kérésfeldolgozással kapjuk a body tartalmát
// app.use(express.urlencoded({ extended: true }));
// formidable-lel dolgozzuk fel a kéréseket
app.use(eformidable({ staticDir }));

function validateDate(date1, date2) {
    if (date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate() && date1.getFullYear() == date2.getFullYear()) {
        return true;
    }
    else {
        return false;
    }
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

    if (cim.length < 3 || telepules.length < 3 || felszin <= 0 || ar < 0 || szobak <= 0 || !validateDate(datum, new Date())) {
        res.end(`Hibás adatokat adtál meg!`);
    }
    else {
        let hirdetes = [advID, cim, telepules, felszin, ar, szobak, datum];
        /*
            0 - ID
            1 - Cím
            2 - Település
            3 - Felszínterület
            4 - Ár
            5 - Szobák száma
            6 - Dátum
        */
        hirdetesek.push(hirdetes);

        res.end(`Your announcement ID is: ${advID}`);
    }

    
});

app.post('/submitPhoto', (req, res) => {
    res.set('Content-Type', 'text/plain;charset=utf-8');

    const fileHandler = req.files.Fenykep;
    const photoID = req.fields.FenykepID;

    if (photoID > hirdetesek.length) {
        res.end(`No advertisment with this ID: ${photoID}`);
    }
    else {
        let newPhoto = [photoID, fileHandler];
        photos.push(newPhoto);
        res.end(`The photo has been uploaded successfully to Advertisment ID: ${photoID}`);
    }
});

app.post('/search', (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    const telepules = req.fields.Telepules;
    const minAr = req.fields.MinAr;
    const maxAr = req.fields.MaxAr;

    /*
        0 - ID
        1 - Cím
        2 - Település
        3 - Felszínterület
        4 - Ár
        5 - Szobák száma
        6 - Dátum
    */

    let found = `These advertisments fit your criteria:\n`;
    let atLeastOne = false;
    hirdetesek.forEach(adv => {
        if (adv[4] >= minAr && adv[4] <= maxAr && adv[2] == telepules) {
            if (!atLeastOne)
                atLeastOne = true;
            found += `ID: ${adv[0]}, Address: ${adv[1]}, Location: ${adv[2]}, Surface area: ${adv[3]}, Price: ${adv[4]}, Number of rooms: ${adv[5]}, Date published: ${adv[6]}\n`;
        }
    })

    if (atLeastOne) {
        res.end(found);
    }
    else {
        res.end(`No advertisments fit your criteria!`);
    }
})

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });











// const respBody = `Feltöltés érkezett:
//     állománynév: ${fileHandler.name}
//     név a szerveren: ${fileHandler.path}
//     privát: ${privateFile}
// `;

// console.log(respBody);
// res.set('Content-Type',
// 'text/plain;charset=utf-8');
// res.end(respBody);