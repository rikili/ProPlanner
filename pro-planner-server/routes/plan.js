const express = require('express');
const router = express.Router();
const plan = require('../models/plan');
const { ObjectId } = require('mongodb');

router.get('/:id', async (req, res) => {
  try {
    new ObjectId(req.params.id);
  } catch (e) {
    res.status(404).send('Invalid plan ID');
    return;
  }
  if (findParams(req.params.id)) {
    const fetchedParams = await getParams(req.params.id);
    if (fetchedParams) {
      const params = fetchedParams.planParameters.toObject();
      console.log(params)
      res.status(200).send(params);
      return;
    }
  }
  res.status(404).send('Invalid plan ID');
});

const findParams = async (id) => {
  return !!(await plan.findOne({ _id: new ObjectId(id) }));
};

const getParams = async (id) => {
  return await plan.findOne({ _id: new ObjectId(id), ['planParameters']: { $exists: true } }, ['planParameters']);
};

module.exports = router;
