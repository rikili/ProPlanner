// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html
// updating object in array references: https://stackoverflow.com/questions/11372065/mongodb-how-do-i-update-a-single-subelement-in-an-array-referenced-by-the-inde
// finding element in embedded array references: https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/
// updating object array references: https://sparkbyexamples.com/mongodb/update-objects-in-the-array-in-mongodb/?expand_article=1
// checking if object is empty references: https://www.freecodecamp.org/news/check-if-an-object-is-empty-in-javascript/
// getting substring by char references: https://stackoverflow.com/questions/9133102/how-to-grab-substring-before-a-specified-character-in-javascript
// returning updated document references: https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
// projecting nested object references: https://stackoverflow.com/questions/70590047/projection-on-nested-object-mongodb-find-query
// reading mongodb object references: https://stackoverflow.com/questions/44833736/object-keys-returns-unexpected-keys-on-mongodb-object-from-collection
// finding key in object references: https://stackoverflow.com/questions/39018389/mongodb-find-key-on-nested-object-key-json

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
    userInfo: { [userId]: userSelections },
  });
  let savedData = await tripModel.save();
  res.status(200).json(savedData);
});

router.put('/:id', async (req, res) => {
  const month = Object.keys(req.body.selection)[0];
  const addedNewUserInfo = await addSelection(req.params.id, req.body.userId, month, req.body.selection[month]);
  res.status(200).send({ month: addedNewUserInfo.toJSON().month });
});

router.get('/:id/:userId', async (req, res) => {
  const monthQuery = req.query.month;
  const userId = req.params.userId;
  const month = `$userInfo.${userId}.${monthQuery}`;
  let requestedMonth = await trip.find(
    { _id: new ObjectId(req.params.id), [`userInfo.${userId}`]: { $exists: true } },
    {
      month: month,
    }
  );
  requestedMonth = requestedMonth[0].toJSON();
  if (!requestedMonth.month) {
    const newMonth = timezone.createMonth(new Date(`${monthQuery.split('-')[0]}-2-${monthQuery.split('-')[1]}`));
    const addedNewMonth = await addSelection(req.params.id, req.params.userId, req.query.month, newMonth);
    res.status(200).send({ month: addedNewMonth.toJSON().month });
  } else {
    res.status(200).send({ month: requestedMonth.month });
  }
});

const addSelection = async (tripId, userId, month, monthToAdd) => {
  const monthPath = `$userInfo.${userId}.${month}`;
  const addMonth = await trip.findOneAndUpdate(
    { _id: new ObjectId(tripId) },
    {
      $set: {
        [`userInfo.${userId}.${month}`]: monthToAdd,
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
