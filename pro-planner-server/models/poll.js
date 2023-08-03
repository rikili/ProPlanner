// code references mongoose documention: https://mongoosejs.com/docs/guide.html , https://mongoosejs.com/docs/models.html, https://mongoosejs.com/docs/schematypes.html

const mongoose = require('mongoose');
const { Schema } = mongoose;
const pollSchema = new Schema(
  {
    eventId: Schema.Types.ObjectId,
    polls: Schema.Types.Mixed,
  },
  {
    collection: 'Poll',
  }
);

module.exports = mongoose.model('Poll', pollSchema);
