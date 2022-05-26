import { Router } from 'express';
import { getAdvertisments } from '../db/advertismentsDB.js';
import { getCurrentUser } from '../auth/middleware.js';

const router = Router();

router.get('/', async (req, res) => {
    const currentUser = getCurrentUser(req);
    try {
        const adv = await getAdvertisments(false);
        res.type('.html');
        res.render('listazas', { hirdetesek: adv, error: '', username: currentUser });
    } catch (err) {
        res.type('.html');
        res.render('listazas', { hirdetesek: [], error: 'Hiba történt a listázás közben', username: currentUser });
    }
});

router.post('/search', async (req, res) => {
    const telepules = req.fields.Telepules;
    const minAr = req.fields.MinAr;
    const maxAr = req.fields.MaxAr;

    const currentUser = getCurrentUser(req);

    try {
        const adv = await getAdvertisments(true, telepules, minAr, maxAr);
        res.type('.html');
        res.render('listazas', { hirdetesek: adv, error: '', username: currentUser });
    } catch (err) {
        console.error(err);
        res.type('.html');
        res.render('listazas', { hirdetesek: [], error: 'Hiba történt az SQL lekérés és a listázás közben.', username: currentUser });
    }
});

export default router;
