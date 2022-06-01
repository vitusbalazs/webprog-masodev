import Router from 'express';
import path from 'path';
import { getCurrentUser } from '../auth/middleware.js';

import { getAdvertisementByID, getPhotosByID, insertPhoto } from '../db/advertisementsDB.js';

const router = new Router();

// google maps api key: AIzaSyCH4U2pxbUxYq_nfJZ0pSszFxOM0k9kWEA

router.get('/details/:id', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        const advID = req.params.id;
        const advertisement = await getAdvertisementByID(advID);
        console.log(advertisement);
        const photos = await getPhotosByID(advID);
        console.log(advertisement);
        res.render('details', {
            errMsg: '', advertisement, photos, loginName,
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

        await insertPhoto(AdvID, filepath);

        res.redirect(`/advertisement/details/${AdvID}`);
    } catch (err) {
        console.log(err);
    }
});

export default router;
