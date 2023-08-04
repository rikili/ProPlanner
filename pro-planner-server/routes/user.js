// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const userHelper = require('../helpers/user');

router.put('/', async (req, res) => {
	const eventId = req.body.eventId;
	const userName = req.body.userName;
	const usersInfo = await userHelper.addUser(eventId, userName);
	const users = usersInfo ? Object.keys(usersInfo) : [];
	res.status(200).json(users);
});

router.delete('/', async (req, res) => {
	const eventId = req.body.eventId;
	const users = req.body.users;
	for (let user of users) {
		await userHelper.deleteUser(eventId, user);
	}
	res.status(200).json(users);
});

router.get('/', async (req, res) => {
	const eventId = req.query.eventId;
	const usersInfo = await userHelper.getUsers(eventId);
	const users = usersInfo ? Object.keys(usersInfo) : [];
	res.status(200).json(users);
});

module.exports = router;
