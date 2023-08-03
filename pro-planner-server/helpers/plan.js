const poll = require('../models/poll');
const eventModel = require('../models/plan');
const { ObjectId } = require('mongodb');

async function createNewEvent(data, planType) {
  try {
    const event = new eventModel({
      planParameters: {
        name: data.name,
        planType: planType,
        dayOffset: data.dayOffset,
        isAllDay: data.isAllDay,
        location: data.location,
        dateTimeRange: data.dateTimeRange,
        description: data.description ? data.description : '',
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
