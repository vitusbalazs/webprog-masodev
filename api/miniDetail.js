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
        res.status(500);
        res.end(JSON.stringify({ err }));
    }
});

export default router;
