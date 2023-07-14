// code references mongoose documention: https://mongoosejs.com/docs/guide.html , https://mongoosejs.com/docs/models.html, https://mongoosejs.com/docs/schematypes.html

const mongoose = require('mongoose');
const { Schema } = mongoose;
const tripSchema = new Schema(
  {
    planParameters: {
      name: Schema.Types.String,
      planType: Schema.Types.String,
      dayOffset: Schema.Types.Array,
      isAllDay: Schema.Types.Boolean,
      location: Schema.Types.String,
      dateTimeRange: Schema.Types.Array,
    },
    userInfo: Schema.Types.Mixed
  },
  {
    collection: 'Trip',
  }
);

module.exports = mongoose.model('Trip', tripSchema);
