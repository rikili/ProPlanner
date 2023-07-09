// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html
// updating mongodb object in array references: https://stackoverflow.com/questions/11372065/mongodb-how-do-i-update-a-single-subelement-in-an-array-referenced-by-the-inde
// finding element in embedded array references: https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/
// updating object array references: https://sparkbyexamples.com/mongodb/update-objects-in-the-array-in-mongodb/?expand_article=1
// checking if object is empty references: https://www.freecodecamp.org/news/check-if-an-object-is-empty-in-javascript/
// getting substring by char references: https://stackoverflow.com/questions/9133102/how-to-grab-substring-before-a-specified-character-in-javascript
// returning updated document references: https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
// projecting nested object references: https://stackoverflow.com/questions/70590047/projection-on-nested-object-mongodb-find-query
// reading mongodb object references: https://stackoverflow.com/questions/44833736/object-keys-returns-unexpected-keys-on-mongodb-object-from-collection
// finding key in object references: https://stackoverflow.com/questions/39018389/mongodb-find-key-on-nested-object-key-json
// change array value by index references: https://stackoverflow.com/questions/5915789/how-to-replace-item-in-array
// changing order or object keys references: https://stackoverflow.com/questions/6959817/changing-the-order-of-the-object-keys

const express = require('express');
const router = express.Router();
const trip = require('../models/trip');
const timezone = require('../helpers/timezone');
const { ObjectId } = require('mongodb');

router.post('/', async (req, res) => {
  // const userId = new ObjectId(req.body.userId);
  // temp userId
  const userId = new ObjectId('649009f3cf33190dacb27a77');
  const userSelections = timezone.makeAvailabilityDates(req.body.selections, req.body.timezone);
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
  const userTimezone = req.body.timezone;
  const tripId = req.params.id;
  const userId = req.body.userId;
  let userSelection = timezone.makeAvailabilityDates(req.body.selection, userTimezone);
  const selectionMonths = Object.keys(userSelection);

  if (selectionMonths.length > 1) {
    const offset = timezone.getOffset(userTimezone);

    let currPrevNextMonth = await getMonth(tripId, userId, selectionMonths[1]);
    currPrevNextMonth = currPrevNextMonth.toJSON();
    if (currPrevNextMonth.month[0] !== null) {
      if (offset >= 6) {
        currPrevNextMonth.month[0][0][0] = userSelection[selectionMonths[1]][0][0];
      } else {
        currPrevNextMonth.month[0][currPrevNextMonth.month[0].length - 1][1] =
          userSelection[selectionMonths[1]][userSelection[selectionMonths[1]].length - 1][1];
      }
      userSelection[selectionMonths[1]] = currPrevNextMonth.month[0];
      // swapping order for convertCalendarLocal() to work
      const swapOrder = {
        [selectionMonths[1]]: null,
        [selectionMonths[0]]: null,
      };
      userSelection = Object.assign(swapOrder, userSelection);
    }
  }

  let addedNewUserInfo = await addSelection(tripId, userId, userSelection);
  addedNewUserInfo = addedNewUserInfo.toJSON();
  if (addedNewUserInfo.month[1].length > 3) {
    addedNewUserInfo.month = timezone.convertCalendarLocal(addedNewUserInfo.month, timezone.getOffset(userTimezone));
  }
  res.status(200).send({ month: addedNewUserInfo.month });
});

router.get('/:id/:userId', async (req, res) => {
  const monthQuery = req.query.month;
  const userId = req.params.userId;
  const userTimezone = req.query.timezone;
  let monthProjection = [`$userInfo.${userId}.${monthQuery}`];

  const offset = timezone.getOffset(userTimezone);
  const nextMonth = timezone.createDateShift(monthQuery, 'next');
  const prevMonth = timezone.createDateShift(monthQuery, 'prev');
  if (offset >= 6) {
    monthProjection.push(`$userInfo.${userId}.${parseInt(nextMonth[0])}-${nextMonth[1]}`);
  } else if (offset <= -6) {
    monthProjection.unshift(`$userInfo.${userId}.${parseInt(prevMonth[0])}-${prevMonth[1]}`);
  }
  let requestedMonth = await trip.findOne(
    { _id: new ObjectId(req.params.id), [`userInfo.${userId}`]: { $exists: true } },
    {
      month: monthProjection,
    }
  );
  requestedMonth = requestedMonth.toJSON();
  if (requestedMonth.month.length > 1) {
    // can only be -1, 0, or 1
    const nullCheckIndex = requestedMonth.month.indexOf(null);
    if (nullCheckIndex !== -1) {
      const monthAfterOrBefore = nullCheckIndex
        ? `${parseInt(nextMonth[0]) + 1}-2-${nextMonth[1]}`
        : `${parseInt(prevMonth[0]) + 1}-2-${prevMonth[1]}`;
      const tempMonth = timezone.createMonth(new Date(monthAfterOrBefore));
      requestedMonth.month[nullCheckIndex] = tempMonth;
    }
    const updatedMonth = timezone.convertCalendarLocal(requestedMonth.month, offset);
    res.status(200).send({ month: updatedMonth });
  } else {
    if (!requestedMonth.month) {
      const newMonth = timezone.createMonth(new Date(`${parseInt(monthQuery.split('-')[0]) + 1}-2-${monthQuery.split('-')[1]}`));
      res.status(200).send({ month: newMonth });
    } else {
      res.status(200).send({ month: requestedMonth.month[0] });
    }
  }
});

const addSelection = async (tripId, userId, monthToAdd) => {
  const months = Object.keys(monthToAdd);
  let addMonth;
  if (months.length > 1) {
    const monthPaths = [`$userInfo.${userId}.${months[0]}`, `$userInfo.${userId}.${months[1]}`];
    addMonth = await trip.findOneAndUpdate(
      { _id: new ObjectId(tripId) },
      {
        $set: {
          [`userInfo.${userId}.${months[0]}`]: monthToAdd[months[0]],
          [`userInfo.${userId}.${months[1]}`]: monthToAdd[months[1]],
        },
      },
      {
        new: true,
        projection: {
          _id: 0,
          month: monthPaths,
        },
      }
    );
  } else {
    const monthPath = `$userInfo.${userId}.${months[0]}`;
    addMonth = await trip.findOneAndUpdate(
      { _id: new ObjectId(tripId) },
      {
        $set: {
          [`userInfo.${userId}.${months[0]}`]: monthToAdd[months[0]],
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
  }
  return addMonth;
};

const getMonth = async (id, userId, month) => {
  let dbMonth = await trip.findOne(
    { _id: new ObjectId(id), [`userInfo.${userId}`]: { $exists: true } },
    {
      month: [`$userInfo.${userId}.${month}`],
    }
  );
  return dbMonth;
};

module.exports = router;
