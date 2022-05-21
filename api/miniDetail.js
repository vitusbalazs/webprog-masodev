import { Router } from 'express';
import { getDetails } from '../db/advertismentsDB.js';

const router = Router();

// fetch API
router.get('/:hirdetesID', async (req, res) => {
    res.set('Content-Type', 'application/json');
    const hid = req.params.hirdetesID;

    try {
        const adv = await getDetails(hid);
        const stringified = JSON.stringify(adv);
        res.end(stringified);
    } catch (err) {
        console.error(err);
        const respBody = `Hiba történt az SQL kérés, vagy a válasz visszaküldése közben... ${err}`;
        res.status(500);
        res.end(respBody);
    }
});

export default router;
