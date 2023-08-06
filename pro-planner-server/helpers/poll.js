// iterating over object references: https://www.freecodecamp.org/news/how-to-iterate-over-objects-in-javascript/
// finding intersect between two arrays references: https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
// mongodb pull from multple items references: https://stackoverflow.com/questions/48709923/mongodb-pull-multiple-objects-from-an-array
// iterating async for loop references: https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971

const poll = require('../models/poll');
const { ObjectId } = require('mongodb');

async function updateDeletedUserPolls(id, usersToDelete) {
  try {
    let polls = await poll.findOne(
      {
        _id: new ObjectId(id),
      },
      {
        _id: 0,
        polls: 1,
      }
    );
    polls = polls.toJSON();
    try {
      const updatedPolls = await updatePolls(id, usersToDelete, polls.polls);
      return updatedPolls;
    } catch (err) {
      return err;
    }
  } catch (err) {
    return err;
  }
}

async function updatePolls(id, usersToDelete, polls) {
  let updatePollArr = getPollsToUpdated(usersToDelete, polls);
  let updatedPoll;
  try {
    for (const pollObj of updatePollArr) {
      const decrement = -pollObj.decrementCount;
      updatedPoll = await poll.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $inc: {
            [`polls.${pollObj.pollId}.options.${pollObj.optionId}.voteCount`]: decrement,
          },
          $pull: {
            [`polls.${pollObj.pollId}.options.${pollObj.optionId}.votedUsers`]: { $in: usersToDelete },
          },
        },
        {
          new: true,
          projection: {
            __v: false,
          },
        }
      );
    }
    return updatedPoll;
  } catch (err) {
    return err;
  }
}

function getPollsToUpdated(usersToDelete, polls) {
  let updatePollArr = [];
  for (const poll in polls) {
    const currPoll = polls[poll];
    const options = currPoll.options;
    for (const option in options) {
      let users = options[option].votedUsers;
      const userDeleteIntersect = usersToDelete.filter((value) => users.includes(value));
      const intersectCount = userDeleteIntersect.length;
      if (intersectCount > 0) {
        updateObj = {
          pollId: poll,
          optionId: option,
          decrementCount: intersectCount,
        };
        updatePollArr.push(updateObj);
      }
    }
  }
  return updatePollArr;
}

module.exports = { updateDeletedUserPolls };
