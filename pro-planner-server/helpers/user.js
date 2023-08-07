// returning updated document references: https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
// updating object array references: https://sparkbyexamples.com/mongodb/update-objects-in-the-array-in-mongodb/?expand_article=1

const { ObjectId } = require('mongodb');
const plan = require('../models/plan');

async function addUser(planId, userName) {
    let users = await plan.findOneAndUpdate(
        { _id: new ObjectId(planId) },
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

async function deleteUser(planId, userName) {
    let user = await plan.findOneAndUpdate(
        { _id: new ObjectId(planId) },
        {
            $unset: {
                [`userInfo.${userName}`]: 1,
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
    return user.toJSON().userInfo;
}

async function getUsers(planId) {
    let users = await plan.findOne(
        { _id: new ObjectId(planId) },
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
    deleteUser,
    getUsers,
};
