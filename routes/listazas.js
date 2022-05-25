import { Router } from 'express';
import { getAdvertisments } from '../db/advertismentsDB.js';

const router = Router();

router.get('/', async (req, res) => {
    const adv = await getAdvertisments(false);
    res.type('.html');
    res.render('listazas', { hirdetesek: adv });
});

router.post('/search', async (req, res) => {
    const telepules = req.fields.Telepules;
    const minAr = req.fields.MinAr;
    const maxAr = req.fields.MaxAr;

    try {
        const adv = await getAdvertisments(true, telepules, minAr, maxAr);
        res.type('.html');
        res.render('listazas', { hirdetesek: adv, error: '' });
    } catch (err) {
        console.error(err);
        res.type('.html');
        res.render('listazas', { hirdetesek: [], error: 'Hiba történt az SQL lekérés és a listázás közben.' });
    }
});

export default router;
