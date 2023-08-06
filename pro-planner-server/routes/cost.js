//  express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const {Cost, UserExpense, Expense} = require("../models/cost");
const { shortToObjectId } = require("../helpers/plan");
const plan = require('../models/plan');
const {ObjectId} = require('mongodb');

const getUserExpense = async (planId) => {
    const planResults = await plan.find({_id: planId}, {"userInfo": 1, "_id": 0});
    const results = new Map();
    Object.values(planResults).forEach((userInfo) => {
        if (userInfo["userInfo"]) {
            Object.entries(userInfo["userInfo"]).forEach(([name, val]) => {
                const userToAdd = {
                    _id: val.id,
                    userName: name,
                    expenses: {}
                }
                results.set(name, UserExpense(userToAdd));
            })
        }
    });
    return results;
}

const getUpdateUserExpense = async (costs, planId) => {
    const planResults = await plan.find({_id: planId}, {"userInfo": 1, "_id": 0});
    Object.values(planResults).forEach((userInfo) => {
        if (userInfo["userInfo"]) {
            Object.entries(userInfo["userInfo"]).forEach(([name, val]) => {
                if (!costs.costs.has(name)) {
                    const userToAdd = {
                        _id: val.id,
                        userName: name,
                        expenses: {}
                    }
                    costs.costs.set(name, UserExpense(userToAdd))
                }
            });
        }
    });
    return costs;
}

router.get('/:id', async (req, res) => {
    const shortPlanId = req.params.id;
    const planOID = await shortToObjectId(shortPlanId);
    
    if (!planOID) {
        res.status(404).send('Plan does not exist.');
        return;
    }

    try {
        let costs = await Cost.findOne({_id: req.params.id});
        if (!costs) {
            const costData = {
                _id: planOID,
                costs: await getUserExpense(planOID)
            };
            newCost = new Cost(costData)
            const savedCost = await newCost.save()
            costs = savedCost;
        } else {
            const updatedGetExpense = await getUpdateUserExpense(costs, planOID);
            await Cost.updateOne({_id: req.params.id}, {$set: {costs: updatedGetExpense.costs.toObject()}});
        }

        res.status(200).json(costs);
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});


router.put('/addExpense/:id', async (req, res) => {
    const shortPlanId = req.params.id;
    const planOID = await shortToObjectId(shortPlanId);
    
    if (!planOID) {
        res.status(404).send('Plan does not exist.');
        return;
    }

    const newExpense = new Expense({
        item: req.body.itemName,
        amount: req.body.itemAmount
    })
    let costDocument;
    try {
        costDocument = await Cost.findOne({_id: planOID});
        const expenseId = new ObjectId();
        costDocument.costs.get(req.body.userName).expenses.set(expenseId, newExpense)
        const savedCosts = await costDocument.save();
        res.status(200).json(savedCosts);
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});


router.put('/removeExpense/:id', async (req, res) => {
    const shortPlanId = req.params.id;
    const planOID = await shortToObjectId(shortPlanId);
    
    if (!planOID) {
        res.status(404).send('Plan does not exist.');
        return;
    }

    let costDocument;
    try {
        costDocument = await Cost.findOne({_id: planOID});
        const userExpenses = costDocument.costs.get(req.body.userName).expenses;
        userExpenses.delete(req.body.expenseId);
        const savedCosts = await costDocument.save();
        res.status(200).json(savedCosts);
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});


router.patch('/removeUser/:id', async (req, res) => {
    let costDocument;
    const shortPlanId = req.params.id;
    const planOID = await shortToObjectId(shortPlanId);
    
    if (!planOID) {
        res.status(404).send('Plan does not exist.');
        return;
    }

    try {
        for (const user of req.body.userToDelete) {
            costDocument = await Cost.findOne({_id: planOID});
            costDocument.costs.delete(user);
            await costDocument.save();
        }
        const savedCosts = await Cost.findOne({_id: planOID});
        res.status(200).json(savedCosts);
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});

module.exports = router;