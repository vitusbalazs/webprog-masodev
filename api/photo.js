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

        let unlinkPath = 'static';
        for (let i = 0; i < pathFromDB.length; i += 1) {
            unlinkPath = path.join(unlinkPath, pathFromDB[i]);
        }
        unlinkSync(unlinkPath);

        await deletePhoto(KID);

        const fotok = await getPhotos(HID);
        const stringified = JSON.stringify(fotok);
        res.end(stringified);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end(JSON.stringify({ err }));
    }
});

export default router;
