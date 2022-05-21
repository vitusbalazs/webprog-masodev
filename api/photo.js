import { Router } from 'express';
import { unlinkSync } from 'fs';
import path from 'path';
import { deletePhoto, getPhotoNameFromID, getPhotos } from '../db/photosDB.js';

const router = Router();

// fetch API
router.delete('/:PID/:ADVID', async (req, res) => {
    res.set('Content-Type', 'application/json');
    const KID = req.params.PID;
    const HID = req.params.ADVID;

    try {
        const photoName = await getPhotoNameFromID(KID);
        const separator = photoName.charAt(0);
        const pathFromDB = photoName.split(separator);
        console.log(pathFromDB);
        let unlinkPath = 'static';
        console.log(`Path array length: ${pathFromDB.length}`);
        for (let i = 0; i < pathFromDB.length; i += 1) {
            unlinkPath = path.join(unlinkPath, pathFromDB[i]);
        }
        console.log(unlinkPath);
        unlinkSync(unlinkPath);
        await deletePhoto(KID);
        const fotok = await getPhotos(HID);
        const stringified = JSON.stringify(fotok);
        res.end(stringified);
    } catch (err) {
        console.error(err);
        const respBody = `<h3>Hiba történt az SQL kérés, vagy a válasz visszaküldése közben... ${err}</h3>`;
        res.status(500);
        res.end(respBody);
    }
});

export default router;
