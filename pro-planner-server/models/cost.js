// code references mongoose documention: https://mongoosejs.com/docs/guide.html , https://mongoosejs.com/docs/models.html, https://mongoosejs.com/docs/schematypes.html

const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
    item: Schema.Types.String,
    amount: Schema.Types.Number
  });
  
const userExpenseSchema = new Schema({
  userName: Schema.Types.String,
  expenses: {
    type: Map,
    of: expenseSchema,
    default: {},
  },
});

const costSchema = new Schema(
    {
        eventId: Schema.Types.ObjectId,
        costs: {
            type: Map,
            of: userExpenseSchema,
            default: {},
          }
    },
    {
      collection: 'Cost',
    }
);

// const costSchema = new Schema(
//   {
//       costs: Schema.Types.Mixed
//   },
//   {
//     collection: 'Cost',
//   }
// );

module.exports = {
  Expense: mongoose.model('Expense', expenseSchema),
  UserExpense: mongoose.model('UserExpenses', userExpenseSchema),
  Cost: mongoose.model('Cost', costSchema),
};