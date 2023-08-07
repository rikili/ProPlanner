//  express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const {Cost, UserExpense, Expense} = require("../models/cost");
const plan = require('../models/plan'); 
const {ObjectId} = require('mongodb');

router.get('/:id', async (req, res) => {    
    try {
        const getUserExpense = async () => {
            const planResults = await plan.find({_id: req.params.id}, {"userInfo": 1, "_id": 0});
            const results = new Map();
            Object.values(planResults).forEach((userInfo) => {
                if (userInfo["userInfo"]){
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

        const getUpdateUserExpense = async (costs) => {
            const planResults = await plan.find({_id: req.params.id}, {"userInfo": 1, "_id": 0});
            Object.values(planResults).forEach((userInfo) => {
                if (userInfo["userInfo"]){
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
        
        let costs = await Cost.findOne({ _id: req.params.id });
        if (!costs) {
            const costData = {
                _id: req.params.id,
                costs: await getUserExpense()
            };
            newCost = new Cost(costData)
            const savedCost = await newCost.save()
            costs = savedCost;
        } else {
            const updatedGetExpense = await getUpdateUserExpense(costs)
            await Cost.updateOne({_id: req.params.id }, {$set: {costs: updatedGetExpense.costs.toObject()}}) 
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


router.patch('/removeUser/:id', async (req, res) => {
    let costDocument;
    try {
        costDocument = await Cost.findOne({ _id: req.params.id });
        const userToDelete = req.body.userToDelete;
        costDocument.costs.delete(userToDelete);
        const savedCosts = await costDocument.save();
        res.status(200).json(savedCosts);
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});

module.exports = router;