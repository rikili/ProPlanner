// code references mongoose documention: https://mongoosejs.com/docs/guide.html , https://mongoosejs.com/docs/models.html, https://mongoosejs.com/docs/schematypes.html
// mongoose allow return empty property references: https://stackoverflow.com/questions/68795159/mongoose-does-not-return-properties-that-are-empty-objects
const mongoose = require('mongoose');
const { Schema } = mongoose;
const planSchema = new Schema(
  {
    planParameters: {
      name: Schema.Types.String,
      planType: Schema.Types.String,
      dayOffset: Schema.Types.Array,
      isAllDay: Schema.Types.Boolean,
      location: Schema.Types.String,
      dateTimeRange: Schema.Types.Array,
      description: Schema.Types.String,
      decision: Schema.Types.Array,
      budget: Schema.Types.Number,
    },
    userInfo: Schema.Types.Mixed,
  },
  {
    collection: 'Plan',
    minimize: false,
  }
);

module.exports = mongoose.model('Plan', planSchema);
