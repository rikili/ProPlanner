const poll = require('../models/poll');
const eventModel = require('../models/event');
const { ObjectId } = require('mongodb');

async function createNewEvent(data) {
  try {
    const event = new eventModel({
      planParameters: {
        name: data.name,
        planType: data.planType,
        dayOffset: data.dayOffset,
        isAllDay: data.isAllDay,
        location: data.location,
        dateTimeRange: data.dateTimeRange,
      },
      decision: [],
    });
    let savedData = await event.save();
    savedData = savedData.toJSON();
    const pollModel = new poll({
      eventId: new ObjectId(savedData._id),
      polls: {},
    });
    await pollModel.save();
    return savedData;
  } catch (err) {
    return { err: err.message };
  }
}

module.exports = {
  createNewEvent,
};
