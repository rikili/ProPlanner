// returning updated document references: https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
// updating object array references: https://sparkbyexamples.com/mongodb/update-objects-in-the-array-in-mongodb/?expand_article=1

const { ObjectId } = require('mongodb');
const plan = require('../models/plan');

async function addUser(eventId, userName) {
  let users = await plan.findOneAndUpdate(
    { _id: new ObjectId(eventId) },
    {
      $set: {
        [`userInfo.${userName}`]: { id: new ObjectId() },
      },
    },
    {
      new: true,
      projection: {
        _id: 0,
        userInfo: 1,
      },
    }
  );
  users = users.toJSON().userInfo;
  return users;
}

async function getUsers(eventId) {
  let users = await plan.findOne(
    { _id: new ObjectId(eventId) },
    {
      _id: 0,
      userInfo: 1,
    }
  );
  users = users.toJSON().userInfo;
  return users;
}

module.exports = {
  addUser,
  getUsers,
};
