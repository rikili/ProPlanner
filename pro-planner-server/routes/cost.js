//  express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const {Cost, UserExpense, Expense} = require("../models/cost");
const trip = require('../models/trip'); // TODO: change this to plan
const cost = require('../models/cost');
const {ObjectId} = require('mongodb');

router.get('/:id', async (req, res) => {    
    try {
        const getUserExpense = async () => {
            const plan = await trip.find({_id: req.params.id}, {"userInfo": 1, "_id": 0});
            const results = new Map();
    
            Object.values(plan).forEach((userInfo) => {
                if (userInfo["userInfo"]){
                    Object.keys(userInfo["userInfo"]).forEach((name) => {
                        const userToAdd = {
                            userName: name,
                            expenses: {}
                        }
                        results.set(name, userToAdd);
                    })
                }
            });
            return UserExpense(results);
        }
    
        let costs = await Cost.findOne({ _id: req.params.id });
        
        if (!costs) {
            const costData = {
                _id: req.params.id,
                costs: await getUserExpense()
            };
            newCost = new Cost(costData)
            const savedCost = await newCost.save()
            costs = savedCost;
        }
        res.status(200).json(costs);
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});


router.put('/addExpense/:id', async (req, res) => {
    const newExpense = new Expense({
        item: req.body.itemName,
        amount: req.body.itemAmount
    })
    
    let costDocument;
    try {
        costDocument = await Cost.findOne({ _id: req.params.id });
        const expenseId = new ObjectId();
        costDocument.costs.get(req.body.userName).expenses.set(expenseId, newExpense)
        const savedCosts = await costDocument.save();
        res.status(200).json(savedCosts);
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});


router.put('/removeExpense/:id', async (req, res) => {
    let costDocument;
    try {
        costDocument = await Cost.findOne({ _id: req.params.id });
        const userExpenses = costDocument.costs.get(req.body.userName).expenses;
        userExpenses.delete(req.body.expenseId);
        const savedCosts = await costDocument.save();
        res.status(200).json(savedCosts);
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});

module.exports = router;