// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const userHelper = require('../helpers/user');
const { doesPlanExist } = require('../helpers/plan');

router.put('/', async (req, res) => {
    const eventId = req.body.eventId;
    const userName = req.body.userName;
    try {
        const usersInfo = await userHelper.addUser(eventId, userName);
        const users = usersInfo ? Object.keys(usersInfo) : [];
        res.status(200).json(users);
    } catch (err) {
        res.status(400).send({ err: err });
    }
});

router.delete('/', async (req, res) => {
    try {
        const eventId = req.body.eventId;
        const users = req.body.users;
        for (let user of users) {
            await userHelper.deleteUser(eventId, user);
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(400).send({ err: err });
    }
});

router.get('/', async (req, res) => {
    const eventId = req.query.eventId;

    if (!(await doesPlanExist(eventId))) {
        res.status(404).send('Plan does not exist');
        return;
    }

    try {
        const usersInfo = await userHelper.getUsers(eventId);
        const users = usersInfo ? Object.keys(usersInfo) : [];
        res.status(200).json(users);
    } catch (err) {
        res.status(400).send({ err: err });
    }
});

module.exports = router;
