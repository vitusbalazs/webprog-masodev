import Router from 'express';
import { getCurrentUser } from '../auth/middleware.js';
import { getAllAdvertisements, filterAdvertisements } from '../db/advertisementsDB.js';

const router = new Router();

router.get('/', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        const advertisements = await getAllAdvertisements();
        res.render('list', { errMsg: '', advertisements, loginName });
    } catch (err) {
        res.render('list', { errMsg: 'An error occured while trying to display the advertisements', advertisements: [], loginName });
    }
});

router.post('/filter', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        console.log('filtering');
        const city = req.fields.sCity;
        const minPrice = req.fields.sMinPrice;
        const maxPrice = req.fields.sMaxPrice;
        console.log(`City: ${city}, Min: ${minPrice}, Max: ${maxPrice}`);
        const advertisements = await filterAdvertisements(city, minPrice, maxPrice);
        console.log('filtered');
        res.render('list', { errMsg: '', advertisements, loginName });
    } catch (err) {
        res.render('list', { errMsg: `An error occured while trying to display the advertisements (${err})`, advertisements: [], loginName });
    }
});

export default router;
