import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { getPhotos, insertPhoto } from '../db/photosDB.js';
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

    let errorWhileCopying = false;
    const whereToStore = path.join(process.cwd(), 'static', 'uploaded', fileHandler.name);
    fs.copyFile(fileHandler.path, whereToStore, (err) => {
        if (err) {
            console.log(err);
            errorWhileCopying = true;
        }
    });
    if (errorWhileCopying) {
        const advertisments = await getDetails(photoID);
        const photos = await getPhotos(photoID);
        res.type('.html');
        res.render('reszletek', { hirdetesek: advertisments, fotok: photos, errorMsg: 'Hiba történt a kép feltölést közben.' });
        return;
    }

    const fromWhereToLoad = path.join('/uploaded', fileHandler.name);

    await insertPhoto(photoID, fromWhereToLoad).catch((error) => {
        console.error(`MySQL insertion error: ${error}`);
        res.type('.html');
        res.render('mysql_error', { tableName: 'fenykep', errMess: error });
    });

    res.redirect(`/ad/${photoID}`);
});

export default router;
