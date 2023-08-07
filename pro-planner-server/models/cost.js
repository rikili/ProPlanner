// code references mongoose documention: https://mongoosejs.com/docs/guide.html , https://mongoosejs.com/docs/models.html, https://mongoosejs.com/docs/schematypes.html

const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema(
    {
        item: Schema.Types.String,
        amount: Schema.Types.Number,
    },
    {
        autoCreate: false,
    }
);

const userExpenseSchema = new Schema(
    {
        userName: Schema.Types.String,
        expenses: {
            type: Map,
            of: expenseSchema,
            default: {},
        },
    },
    {
        autoCreate: false,
    }
);

const costSchema = new Schema(
    {
        eventId: Schema.Types.ObjectId,
        costs: {
            type: Map,
            of: userExpenseSchema,
            default: {},
        },
    },
    {
        collection: 'Cost',
    }
);

module.exports = {
    Expense: mongoose.model('Expense', expenseSchema),
    UserExpense: mongoose.model('UserExpenses', userExpenseSchema),
    Cost: mongoose.model('Cost', costSchema),
};
