// code references mongoose documention: https://mongoosejs.com/docs/guide.html , https://mongoosejs.com/docs/models.html, https://mongoosejs.com/docs/schematypes.html

const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    name: Schema.Types.String,
  },
  {
    collection: 'User',
  }
);

module.exports = mongoose.model('User', UserSchema);
