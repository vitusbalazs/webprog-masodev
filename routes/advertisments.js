import Router from 'express';
import { getAdvertismentByID } from '../db/advertismentsDB.js';

const router = new Router();

router.get('/details/:id', async (req, res) => {
    res.type('.html');
    try {
        const advID = req.params.id;
        const advertisment = await getAdvertismentByID(advID);
        res.render('details', { errMsg: '', advertisment });
    } catch (err) {
        res.render('details', { errMsg: 'An error occured while trying to display the advertisments', advertisments: [] });
    }
});

export default router;
