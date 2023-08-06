const express = require('express');
const router = express.Router();
const plan = require('../models/plan');
const { shortToObjectId } = require("../helpers/plan");
const { ObjectId } = require('mongodb');

router.get('/:id', async (req, res) => {
  const shortPlanId = req.params.id;
  const planOID = await shortToObjectId(shortPlanId);
  
  if (!planOID) {
    res.status(404).send('Invalid plan ID');
    return;
  }

  if (findParams(planOID)) {
    const fetchedParams = await getParams(planOID);
    if (fetchedParams) {
      const params = fetchedParams.planParameters.toObject();
      res.status(200).send(params);
      return;
    }
  }
  res.status(404).send('Invalid plan ID');
});

router.put('/:id', async (req, res) => {
  const shortPlanId = req.params.id;
  const planOID = await shortToObjectId(shortPlanId);
  
  if (!planOID) {
    res.status(404).send('Plan does not exist.');
    return;
  }

  const data = req.body;
  const newParams = {
    name: data.name,
    planType: data.planType,
    dayOffset: data.dayOffset,
    isAllDay: data.isAllDay,
    location: data.location,
    dateTimeRange: data.dateTimeRange,
    description: data.description,
    decision: data.decision,
    budget: data.budget,
  };

  try {
    let updatedParams = await plan.findOneAndUpdate(
      { _id: new ObjectId(planOID) },
      {
        $set: { planParameters: newParams },
      },
      {
        new: true,
        projection: {
          _id: 0,
          planParameters: 1,
        },
      }
    );
    updatedParams = updatedParams.toJSON();
    res.status(200).json(updatedParams.planParameters);
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

const findParams = async (id) => {
  return !!(await plan.findOne({ _id: new ObjectId(id) }));
};

const getParams = async (id) => {
  return await plan.findOne({ _id: new ObjectId(id), ['planParameters']: { $exists: true } }, ['planParameters']);
};

module.exports = router;
