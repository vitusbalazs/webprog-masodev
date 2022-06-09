import Router from 'express';

import { getCurrentUser, validateJWT } from '../auth/middleware.js';
import {
    getAllUsers, getUserFromName,
} from '../db/usersMongo.js';
import {
    getMessagesByUsername, insertNewMessage,
} from '../db/messagesMongo.js';

const router = new Router();

router.get('/', validateJWT);

router.get('/getMessages', async (req, res) => {
    const targetUsername = req.query.target;
    const sourceUsername = req.query.source;
    try {
        const messages = await getMessagesByUsername(sourceUsername);
        const newMessages = [];
        messages.forEach((message) => {
            if (message.userReceived === targetUsername || message.userSent === targetUsername) {
                newMessages.push(message);
            }
        });
        const stringified = JSON.stringify(newMessages);
        res.status(200);
        res.end(stringified);
    } catch (err) {
        res.status(500);
        res.end(err);
    }
});

router.post('/sendMessage', async (req, res) => {
    const sourceUsername = req.query.source;
    const targetUsername = req.query.target;
    const msg = req.query.message;

    try {
        const msgData = {
            message: msg,
            userSent: sourceUsername,
            userReceived: targetUsername,
            date: new Date(),
        };
        await insertNewMessage(msgData);
        res.status(200);
        res.end();
    } catch (err) {
        res.status(500);
        res.end(err);
    }
});

router.get('/', async (req, res) => {
    res.type('.html');
    const loginName = getCurrentUser(req) || undefined;
    try {
        const userFromDB = await getUserFromName(loginName);
        const users = await getAllUsers();
        res.render('chat', {
            errMsg: '', successMsg: '', userFromDB, loginName, navbarActive: 6, users,
        });
    } catch (err) {
        res.render('chat', {
            errMsg: 'Error occured while trying to open chat!', successMsg: '', userFromDB: null, loginName, navbarActive: 6, users: null,
        });
    }
});

export default router;
