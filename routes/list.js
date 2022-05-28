import Router from 'express';
import { getAllAdvertisments, filterAdvertisments } from '../db/advertismentsDB.js';

const router = new Router();

router.get('/', async (req, res) => {
    res.type('.html');
    try {
        const advertisments = await getAllAdvertisments();
        res.render('list', { errMsg: '', advertisments });
    } catch (err) {
        res.render('list', { errMsg: 'An error occured while trying to display the advertisments', advertisments: [] });
    }
});

router.post('/filter', async (req, res) => {
    res.type('.html');
    try {
        console.log('filtering');
        const city = req.fields.sCity;
        const minPrice = req.fields.sMinPrice;
        const maxPrice = req.fields.sMaxPrice;
        console.log(`City: ${city}, Min: ${minPrice}, Max: ${maxPrice}`);
        const advertisments = await filterAdvertisments(city, minPrice, maxPrice);
        console.log('filtered');
        res.render('list', { errMsg: '', advertisments });
    } catch (err) {
        res.render('list', { errMsg: `An error occured while trying to display the advertisments (${err})`, advertisments: [] });
    }
});

export default router;
