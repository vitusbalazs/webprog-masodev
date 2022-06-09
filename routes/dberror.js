import Router from 'express';

const router = new Router();

router.use('/', (req, res) => {
    res.type('.html');
    res.render('dberror');
});

export default router;
