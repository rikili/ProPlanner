// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const userHelper = require('../helpers/user');
const { doesPlanExist } = require('../helpers/plan');
const { shortToObjectId } = require("../helpers/plan");

router.put('/', async (req, res) => {
  const shortPlanId = req.body.eventId;
  const planOID = await shortToObjectId(shortPlanId);
  
  if (!planOID) {
      res.status(404).send('Plan does not exist.');
      return;
  }

  const userName = req.body.userName;
  try {
    const usersInfo = await userHelper.addUser(planOID, userName);
    const users = usersInfo ? Object.keys(usersInfo) : [];
    res.status(200).json(users);
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

router.delete('/', async (req, res) => {
  const shortPlanId = req.body.eventId;
  const planOID = await shortToObjectId(shortPlanId);
  
  if (!planOID) {
      res.status(404).send('Plan does not exist.');
      return;
  }

  try {
    const users = req.body.users;
    for (let user of users) {
      await userHelper.deleteUser(planOID, user);
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

router.get('/', async (req, res) => {
  const shortPlanId = req.query.eventId;
  const planOID = await shortToObjectId(shortPlanId);
  
  if (!planOID) {
      res.status(404).send('Plan does not exist.');
      return;
  }

  if (!await doesPlanExist(planOID)) {
    res.status(404).send('Plan does not exist');
    return;
  }

  try {
    const usersInfo = await userHelper.getUsers(planOID);
    const users = usersInfo ? Object.keys(usersInfo) : [];
    res.status(200).json(users);
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

module.exports = router;
