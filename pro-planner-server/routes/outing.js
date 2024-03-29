// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html
// checking if object is empty references: https://www.freecodecamp.org/news/check-if-an-object-is-empty-in-javascript/

const express = require('express');
const router = express.Router();
const plan = require('../models/plan');
const { ObjectId } = require('mongodb');
const planHelper = require('../helpers/plan');

router.post('/', async (req, res) => {
    const savedData = await planHelper.createNewEvent(req.body, 'outing');
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
        const addMonth = await plan.findOneAndUpdate(
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
        const monthPath = `$userInfo.${userId}.${month}`;
        let queryMonth = await plan.findOne(
            { _id: new ObjectId(outingId), [`userInfo.${userId}`]: { $exists: true } },
            {
                _id: 0,
                month: monthPath,
            }
        );
        queryMonth = queryMonth.toJSON();
        if (Object.keys(queryMonth).length === 0) {
            queryMonth = { month: {} };
        }
        res.status(200).json(queryMonth);
    } catch (err) {
        res.status(404).send({ err: err });
    }
});

router.put('/decision/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const decision = req.body.decision;
        const addedDecision = await planHelper.addDecision(id, decision);
        res.status(200).json(addedDecision);
    } catch (err) {
        res.status(400).send({ err: err });
    }
});

module.exports = router;
