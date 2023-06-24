// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html
// updating object in array references: https://stackoverflow.com/questions/11372065/mongodb-how-do-i-update-a-single-subelement-in-an-array-referenced-by-the-inde
// finding element in embedded array references: https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/
// updating object array references: https://sparkbyexamples.com/mongodb/update-objects-in-the-array-in-mongodb/?expand_article=1
// checking if object is empty references: https://www.freecodecamp.org/news/check-if-an-object-is-empty-in-javascript/
// getting substring by char references: https://stackoverflow.com/questions/9133102/how-to-grab-substring-before-a-specified-character-in-javascript
// returning updated document references: https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
// projecting nested object references: https://stackoverflow.com/questions/70590047/projection-on-nested-object-mongodb-find-query

const express = require('express');
const router = express.Router();
const trip = require('../models/trip');
const timezone = require('../helpers/timezone');
const { ObjectId } = require('mongodb');

router.get('/', (req, res) => {
  res.send('trip');
});

router.get('/:id', async (req, res) => {});

router.post('/', async (req, res) => {
  // const userId = new ObjectId(req.body.userId);
  const userId = new ObjectId('649009f3cf33190dacb27a77');
  const userSelections = timezone.makeAvailabilityDates(req.body.selections);
  const tripModel = new trip({
    planParameters: {
      name: req.body.name,
      planType: req.body.planType,
      availableDays: req.body.availableDays,
      isAllDay: req.body.isAllDay,
      location: req.body.location,
      dateTimeRange: req.body.dateTimeRange,
    },
    userInfo: [{ user: userId, selections: userSelections }],
  });
  let savedData = await tripModel.save();
  res.status(200).json(savedData);
});

router.put('/:id', async (req, res) => {
  const month = Object.keys(req.body.selection)[0];
  const addedNewUserInfo = await addSelection(req.params.id, req.body.userId, month, req.body.selection[month]);
  res.status(200).send(addedNewUserInfo.toJSON().month);
});

router.get('/:id/:userId/:month?', async (req, res) => {
  const monthQuery = req.query.month;
  const month = `$userInfo.selections.${monthQuery}`;
  const requestedMonth = await trip.find(
    { _id: new ObjectId(req.params.id), 'userInfo.user': new ObjectId(req.params.userId) },
    {
      month: month,
    }
  );
  if (requestedMonth[0].month === undefined) {
    const newMonth = timezone.createMonth(new Date(`${monthQuery.split('-')[0]}-2-${monthQuery.split('-')[1]}`));
    const addedNewMonth = await addSelection(req.params.id, req.params.userId, req.query.month, newMonth);
    res.send(addedNewMonth.toJSON().month);
  } else {
    res.status(200).send(requestedMonth.toJSON().month);
  }
});

const addSelection = async (tripId, userId, month, monthToAdd) => {
  const monthPath = `$userInfo.selections.${month}`;
  const addMonth = await trip.findOneAndUpdate(
    { _id: new ObjectId(tripId), 'userInfo.user': new ObjectId(userId) },
    {
      $set: {
        [`userInfo.$.selections.${month}`]: monthToAdd,
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
  return addMonth;
};

module.exports = router;
