//  express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const {Cost, UserExpense, Expense} = require("../models/cost");

router.get('/:id', async (req, res) => {
    // If eventId doesn't exist, create one and add it to mongodb
    // If exists, return resutls

    const getUserExpense = () => {
        // TODO: fetches users and add a UserExpense for each user
        return {};
    }

    const costs = await Cost.findOne({ eventId: req.params.id });
    if (!costs) {
        const costData = {
            eventId: req.params.id,
            costs: getUserExpense()
        };
        newCost = new Cost(costData)
        const savedCost = await newCost.save()
    }

    // try {
    //     console.log("object ID Exists: ")
    //     console.log(req.params.id)
    //     const doc = new ObjectId(req.params.id);
        
    //     console.log("fetched costs: " + costs);
    // } catch (e) {
    //     console.log("ERROR")
    //     return;
    // }
    console.log("Requesting costs")
    res.json('');
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