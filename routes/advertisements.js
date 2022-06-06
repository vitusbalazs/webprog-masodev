import Router from 'express';
import { unlinkSync } from 'fs';
import path from 'path';
import { getCurrentUser } from '../auth/middleware.js';

import {
    getAdvertisementByID, getPhotosIndex, getUserFromID,
    insertPhoto, getPhotosByID, deletePhotoByID, getUserFromName,
} from '../db/connectMongo.js';

const router = new Router();

// google maps api key: AIzaSyCH4U2pxbUxYq_nfJZ0pSszFxOM0k9kWEA

router.get('/details/:id', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        const advID = req.params.id;
        const advertisement = await getAdvertisementByID(advID);
        const userUploaded = await getUserFromID(advertisement.UserID);
        const photos = await getPhotosByID(advID);
        const localUser = await getUserFromName(loginName);
        res.render('details', {
            errMsg: '', successMsg: '', advertisement, photos, loginName, userUploaded, navbarActive: 1, localUser,
        });
    } catch (err) {
        res.render('details', {
            errMsg: 'An error occured while trying to display the advertisements', successMsg: '', advertisements: [], loginName, navbarActive: 1,
        });
    }
});

router.post('/details/uploadphoto/:id', async (req, res) => {
    const AdvID = req.params.id;

    try {
        const fileHandler = req.files.pFile;

        const filename = fileHandler.path.split(path.sep).pop();
        const filepath = path.join('/uploaded', filename);

        const photoID = await getPhotosIndex();

        const photoData = {
            _id: photoID,
            AdvertisementID: AdvID,
            Path: filepath,
        };

        await insertPhoto(photoData);

        res.redirect(`/advertisement/details/${AdvID}`);
    } catch (err) {
        console.log(err);
    }
});

router.delete('/deletePhoto/:id', async (req, res) => {
    const toDeletePhotoID = req.params.id;
    try {
        const photoPath = await deletePhotoByID(toDeletePhotoID);
        const separator = photoPath.charAt(0);
        const pathFromDB = photoPath.split(separator);

        let unlinkPath = 'static';
        for (let i = 0; i < pathFromDB.length; i += 1) {
            unlinkPath = path.join(unlinkPath, pathFromDB[i]);
        }
        unlinkSync(unlinkPath);

        res.status(200);
        res.end();
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end();
    }
});

export default router;
