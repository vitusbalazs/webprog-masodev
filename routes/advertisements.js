import Router from 'express';
import path from 'path';
import { getCurrentUser } from '../auth/middleware.js';

import {
    getAdvertisementByID, getAdvertisementsIndex, getPhotosIndex, getUserFromID, getUserFromName,
    insertAdvertisement, insertPhoto, getPhotosByID,
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
        res.render('details', {
            errMsg: '', advertisement, photos, loginName, userUploaded,
        });
    } catch (err) {
        res.render('details', { errMsg: 'An error occured while trying to display the advertisements', advertisements: [], loginName });
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

router.post('/submit', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        const advID = await getAdvertisementsIndex();
        const user = await getUserFromName(loginName);
        const userID = user._id;
        const advertisementData = {
            _id: advID,
            ID: advID,
            UserID: userID,
            Address: req.fields.sAddress,
            City: req.fields.sCity,
            Surface: req.fields.sSurface,
            Price: req.fields.sPrice,
            Rooms: req.fields.sRooms,
            Date: req.fields.sDate,
        };
        await insertAdvertisement(advertisementData);

        res.render('submit', { loginName, errMsg: '', successMsg: 'Inserted successfully!' });
    } catch (err) {
        res.render('submit', { loginName, errMsg: 'Error while inserting new advertisement!', successMsg: '' });
    }
});

router.get('/submit', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        res.render('submit', { loginName, errMsg: '', successMsg: '' });
    } catch (err) {
        res.render('submit', { loginName, errMsg: 'Error while inserting new advertisement!', successMsg: '' });
    }
});

router.get('/submit', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        res.render('submit', { loginName });
    } catch (err) {
        console.log(err);
    }
});

export default router;
