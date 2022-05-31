import Router from 'express';
import { getCurrentUser } from '../auth/middleware.js';
import { getAllAdvertisments, filterAdvertisments } from '../db/advertismentsDB.js';

const router = new Router();

router.get('/', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || 'Not logged in';
    try {
        const advertisments = await getAllAdvertisments();
        res.render('list', { errMsg: '', advertisments, loginName });
    } catch (err) {
        res.render('list', { errMsg: 'An error occured while trying to display the advertisments', advertisments: [], loginName });
    }
});

router.post('/filter', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || 'Not logged in';
    try {
        console.log('filtering');
        const city = req.fields.sCity;
        const minPrice = req.fields.sMinPrice;
        const maxPrice = req.fields.sMaxPrice;
        console.log(`City: ${city}, Min: ${minPrice}, Max: ${maxPrice}`);
        const advertisments = await filterAdvertisments(city, minPrice, maxPrice);
        console.log('filtered');
        res.render('list', { errMsg: '', advertisments, loginName });
    } catch (err) {
        res.render('list', { errMsg: `An error occured while trying to display the advertisments (${err})`, advertisments: [], loginName });
    }
});

export default router;
