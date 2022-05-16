import { Router } from 'express';
import { getAdvertisments, getDetails } from '../db/advertismentsDB.js';

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

// fetch API
router.post('/showMiniDetails/:hirdetesID', async (req, res) => {
    res.set('Content-Type', 'text/plain;charset=utf-8');
    const hid = req.params.hirdetesID;

    try {
        const adv = await getDetails(hid);
        const respBody = `További információk:
            Cím: ${adv[0].Cim}
            Település: ${adv[0].Telepules}
            Ár: ${adv[0].Ar}
            Felszínterület: ${adv[0].Felszinterulet}
            Szobák: ${adv[0].Szobak}
            Dátum: ${adv[0].Datum}
            Feltöltötte: ${adv[0].Nev}
        `;
        res.end(respBody);
    } catch (err) {
        console.error(err);
        const respBody = `Hiba történt az SQL kérés, vagy a válasz visszaküldése közben... ${err}`;
        res.end(respBody);
    }
});

export default router;
