import Router from 'express';
import { getCurrentUser } from '../auth/middleware.js';

import { getAdvertismentByID } from '../db/advertismentsDB.js';

const router = new Router();

router.get('/details/:id', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || 'Not logged in';
    try {
        const advID = req.params.id;
        const advertisment = await getAdvertismentByID(advID);
        res.render('details', { errMsg: '', advertisment, loginName });
    } catch (err) {
        res.render('details', { errMsg: 'An error occured while trying to display the advertisments', advertisments: [], loginName });
    }
});

export default router;
