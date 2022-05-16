import { Router } from 'express';
import path from 'path';
import { deletePhoto, getPhotos, insertPhoto } from '../db/photosDB.js';
import { getDetails } from '../db/advertismentsDB.js';

const router = Router();

router.get('/:adID', async (req, res) => {
    const ad = req.params.adID;
    const advertisments = await getDetails(ad);
    const photos = await getPhotos(ad);

    res.type('.html');
    res.render('reszletek', { hirdetesek: advertisments, fotok: photos, errorMsg: '' });
});

router.post('/submitPhoto/:advID', async (req, res) => {
    const fileHandler = req.files.Fenykep;
    const photoID = req.params.advID;

    const filename = fileHandler.path.split('\\').pop();
    const filepath = path.join('/uploaded', filename);

    await insertPhoto(photoID, filepath).catch((error) => {
        console.error(`MySQL insertion error: ${error}`);
        res.type('.html');
        res.render('mysql_error', { tableName: 'fenykep', errMess: error });
    });

    res.redirect(`/ad/${photoID}`);
});

router.post('/deletePhoto/:PID/:ADVID', async (req, res) => {
    res.set('Content-Type', 'text/plain;charset=utf-8');
    const KID = req.params.PID;
    const HID = req.params.ADVID;

    try {
        await deletePhoto(KID);
        const fotok = await getPhotos(HID);

        let respBody = '';
        fotok.forEach((f) => {
            respBody += '<div class="fotok-item">';
            respBody += `<img alt="${f.KID}" src="${f.KepPath}">`;
            respBody += `<button id="${f.KID}" class="details" onclick="deletePhoto(this.id, ${f.HID});">Fénykép törlése</button>`;
            respBody += '</div>';
        });
        respBody += '<h3>A fotó sikeresen törölve lett!</h3>';

        res.end(respBody);
    } catch (err) {
        console.error(err);
        const respBody = `<h3>Hiba történt az SQL kérés, vagy a válasz visszaküldése közben... ${err}</h3>`;
        res.end(respBody);
    }
});

export default router;
