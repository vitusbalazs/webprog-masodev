import { Router } from 'express';
import path from 'path';
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

    const filename = fileHandler.path.split(path.sep).pop();
    const filepath = path.join('/uploaded', filename);

    await insertPhoto(photoID, filepath).catch((error) => {
        console.error(`MySQL insertion error: ${error}`);
        res.type('.html');
        res.render('mysql_error', { tableName: 'fenykep', errMess: error });
    });

    res.redirect(`/ad/${photoID}`);
});

export default router;
