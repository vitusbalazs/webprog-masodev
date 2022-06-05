import Router from 'express';
import { getCurrentUser, validateJWT } from '../auth/middleware.js';

import { getAdvertisementsIndex, getUserFromName, insertAdvertisement } from '../db/connectMongo.js';

const router = new Router();

router.use('/', validateJWT);

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

export default router;
