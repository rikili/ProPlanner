// code references mongoose documention: https://mongoosejs.com/docs/guide.html , https://mongoosejs.com/docs/models.html, https://mongoosejs.com/docs/schematypes.html

const mongoose = require('mongoose');
const { Schema } = mongoose;
const eventSchema = new Schema(
  {
    planParameters: {
      name: Schema.Types.String,
      planType: Schema.Types.String,
      dayOffset: Schema.Types.Array,
      isAllDay: Schema.Types.Boolean,
      location: Schema.Types.String,
      dateTimeRange: Schema.Types.Array,
    },
    userInfo: Schema.Types.Mixed,
    decision: Schema.Types.Array,
  },
  {
    collection: 'Event',
  }
);

module.exports = mongoose.model('Event', eventSchema);
