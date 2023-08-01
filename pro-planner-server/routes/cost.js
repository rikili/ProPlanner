//  express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const {Cost, UserExpense, Expense} = require("../models/cost");
const trip = require('../models/trip'); // TODO: change this to plan

router.get('/:id', async (req, res) => {
    // If eventId doesn't exist, create one and add it to mongodb
    // If exists, return resutls

    
    const getUserExpense = async () => {
        const plan = await trip.find({_id: req.params.id}, {"userInfo": 1, "_id": 0});
        // const results = {};
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
        const x = UserExpense(results)
        return results;
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
    res.json(costs);
});


router.post('/:id', async (req, res) => {
    
    const newExpense = new Expense({
        item: req.body.itemName,
        amount: req.body.itemAmount
    })
    // add an newExpense to the user's expenses
    console.log(expense);
    
    console.log(req.body)
    res.json('');
});

module.exports = router;