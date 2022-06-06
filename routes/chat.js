import Router from 'express';
import { getCurrentUser } from '../auth/middleware.js';
import { getAllUsers, getMessagesByUsername, getUserFromName } from '../db/connectMongo.js';

const router = new Router();

router.get('/', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        const userFromDB = getUserFromName(loginName);
        const messages = await getMessagesByUsername(loginName);
        const users = await getAllUsers();
        res.render('chat', {
            errMsg: '', successMsg: '', userFromDB, loginName, navbarActive: 6, messages, users,
        });
    } catch (err) {
        res.render('chat', {
            errMsg: 'Error occured while trying to open chat!', successMsg: '', userFromDB: null, loginName, navbarActive: 6, messages: null, users: null,
        });
    }
});

export default router;
