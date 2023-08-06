// references: https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/
// removing object field referenecs: https://www.w3schools.com/howto/howto_js_remove_property_object.asp

const poll = require('../models/poll');
const planModel = require('../models/plan');
const { ObjectId } = require('mongodb');

async function createNewEvent(data, planType) {
  try {
    const event = new planModel({
      planParameters: {
        name: data.name,
        planType: planType,
        dayOffset: data.dayOffset,
        isAllDay: data.isAllDay,
        location: data.location,
        dateTimeRange: data.dateTimeRange,
        description: data.description,
        decision: [],
        budget: data.budget,
      },
    });
    let savedData = await event.save();
    savedData = savedData.toJSON();
    const pollModel = new poll({
      eventId: new ObjectId(savedData._id),
      polls: {},
    });
    await pollModel.save();

    // format return
    savedData = {
      id: savedData['_id'],
      planParameters: savedData.planParameters,
    };

    return savedData;
  } catch (err) {
    return { err: err.message };
  }
}

async function addDecision(id, decision) {
  const decisionPath = 'planParameters.decision';
  let newDecision = await planModel.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { [decisionPath]: decision } },
    {
      new: true,
      projection: {
        ['decision']: `$${decisionPath}`,
      },
    }
  );
  newDecision = newDecision.toJSON();
  delete newDecision._id;
  return newDecision;
}

async function doesPlanExist(id) {
  try {
    const plan = await planModel.findOne({ _id: new ObjectId(id) });
    return !!plan;
  } catch {
    return false;
  }
}

module.exports = {
  createNewEvent,
  addDecision,
  doesPlanExist
};
