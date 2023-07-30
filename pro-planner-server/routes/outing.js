// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const event = require('../models/event');
const { ObjectId } = require('mongodb');
const eventHelper = require('../helpers/event');

router.post('/', async (req, res) => {
  const savedData = await eventHelper.createNewEvent(req.body);
  if (!savedData.err) {
    res.status(200).json(savedData);
  } else {
    res.status(400).send(savedData);
  }
});

router.put('/:id', async (req, res) => {
  const outingId = req.params.id;
  const userId = req.body.userId;
  const selection = req.body.selections;
  const month = Object.keys(selection);
  const monthPath = `$userInfo.${userId}.${month}`;
  try {
    const addMonth = await event.findOneAndUpdate(
      { _id: new ObjectId(outingId) },
      {
        $set: {
          [`userInfo.${userId}.${month}`]: selection[month],
        },
      },
      {
        new: true,
        projection: {
          _id: 0,
          month: monthPath,
        },
      }
    );
    res.status(200).json(addMonth);
  } catch (err) {
    res.status(400).send('Selection not added');
  }
});

router.get('/:id/:userId', async (req, res) => {
  const outingId = req.params.id;
  const userId = req.params.userId;
  const month = req.query.month;
  try {
    const monthPath = [`$userInfo.${userId}.${month}`];
    let queryMonth = await event.findOne(
      { _id: new ObjectId(outingId), [`userInfo.${userId}`]: { $exists: true } },
      {
        _id: 0,
        month: monthPath,
      }
    );
    queryMonth = queryMonth.toJSON();
    if (queryMonth.month[0] !== null) {
      res.status(200).json(queryMonth);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (err) {
    res.status(404).send('Not Found');
  }
});

module.exports = router;
