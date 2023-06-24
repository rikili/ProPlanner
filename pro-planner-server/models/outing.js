// code references mongoose documention: https://mongoosejs.com/docs/guide.html , https://mongoosejs.com/docs/models.html, https://mongoosejs.com/docs/schematypes.html

const mongoose = require('mongoose');
const { Schema } = mongoose;
const OutingSchema = new Schema(
  {
    date: Schema.Types.Date,
    planParameters: {
      name: Schema.Types.String,
      planType: Schema.Types.String,
      availableDays: Schema.Types.Array,
      isAllDay: Schema.Types.Boolean,
      location: Schema.Types.String,
      dateTimeRange: Schema.Types.Date,
    },
    userInfo: [{ user: Schema.Types.ObjectId, availabilities: [{ start: Schema.Types.Date, end: Schema.Types.Date }] }],
  },
  {
    collection: 'Outing',
  }
);

module.exports = mongoose.model('Outing', OutingSchema);
