import Router from 'express';
import { getCurrentUser } from '../auth/middleware.js';
import { filterAdvertisements, getAllAdvertisements } from '../db/connectMongo.js';

const router = new Router();

router.get('/', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        const advertisements = await getAllAdvertisements();
        res.render('list', {
            errMsg: '', advertisements, loginName, navbarActive: 1,
        });
    } catch (err) {
        res.render('list', {
            errMsg: 'An error occured while trying to display the advertisements', advertisements: [], loginName, navbarActive: 1,
        });
    }
});

router.post('/filter', async (req, res) => {
    //
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        const city = req.fields.sCity;
        const minPrice = req.fields.sMinPrice;
        const maxPrice = req.fields.sMaxPrice;
        const advertisements = await filterAdvertisements(city, minPrice, maxPrice);
        res.render('list', {
            errMsg: '', advertisements, loginName, navbarActive: 1,
        });
    } catch (err) {
        res.render('list', {
            errMsg: `An error occured while trying to display the advertisements (${err})`, advertisements: [], loginName, navbarActive: 1,
        });
    }
});

export default router;
