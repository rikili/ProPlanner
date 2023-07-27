// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const trip = require('../models/trip');
const outing = require('../models/outing');
const userHelper = require('../helpers/user');

router.put('/', async (req, res) => {
  const eventType = req.body.eventType;
  const eventId = req.body.eventId;
  const userName = req.body.userName;
  let addedUser;
  if (eventType === 'trip') {
    addedUser = await userHelper.addUser(trip, eventId, userName);
  } else {
    addedUser = await userHelper.addUser(outing, eventId, userName);
  }
  res.status(200).json(addedUser);
});

router.get('/', async (req, res) => {
  const eventType = req.query.eventType;
  const eventId = req.query.eventId;
  let users;
  if (eventType === 'trip') {
    users = await userHelper.getUsers(trip, eventId);
  } else {
    users = await userHelper.getUsers(outing, eventId);
  }
  res.status(200).json(users);
});

module.exports = router;
