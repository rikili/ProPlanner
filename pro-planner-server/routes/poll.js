// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html
// don't return _id references https://stackoverflow.com/questions/22121145/how-to-prevent-mongodb-from-returning-the-object-id-when-finding-a-document
// returning updated document references: https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
// updating object in array references: https://sparkbyexamples.com/mongodb/update-objects-in-the-array-in-mongodb/?expand_article=1 , https://stackoverflow.com/questions/10522347/how-do-you-update-objects-in-a-documents-array-nested-updating
// decrementing in mongodb references: https://stackoverflow.com/questions/26560366/how-to-decrement-like-dec

const express = require('express');
const router = express.Router();
const poll = require('../models/poll');
const { ObjectId } = require('mongodb');

// gets the entire poll document, needs the eventId (id of trip/outing)
router.get('/:id', async (req, res) => {
  const polls = await poll.findOne({ eventId: new Object(req.params.eventId) }, { __v: false });
  res.json(polls);
});

// adds new poll into the polls
// needs id of the poll document
router.put('/:id', async (req, res) => {
  const pollId = new ObjectId();
  const addedPoll = await poll.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        [`polls.${pollId}`]: {
          question: req.body.question,
          options: {
            voteUser: [],
          },
        },
      },
    },
    {
      new: true,
      projection: {
        __v: false,
      },
    }
  );
  res.json(addedPoll);
});

// adds a new option
// needs id of the poll document and the poll id under polls
router.put('/option/:id/:pollId', async (req, res) => {
  const optionId = new ObjectId();
  const addOption = {
    option: req.body.option,
    voteCount: 0,
  };
  const addedPoll = await poll.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        [`polls.${req.params.pollId}.options.${optionId}`]: addOption,
      },
    },
    {
      new: true,
      projection: {
        __v: false,
      },
    }
  );
  res.json(addedPoll);
});

// handles when users make a vote (updates the voteCount under options & updates the user's votedOptionId under voteUsers)
// needs id of the poll document, the poll id under polls, user's name (user field), user's existing votedOptionId (null if they didn't vote before), and new option id
router.patch('/vote/:id/:pollId', async (req, res) => {
  const id = req.params.id;
  const pollId = req.params.pollId;
  const user = req.body.user;
  const currUserVoteId = req.body.votedOptionId;
  const newVotedOptionId = req.body.newVotedOptionId;

  // decrements prev user vote in options
  if (currUserVoteId) {
    await poll.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: {
          [`polls.${pollId}.options.${currUserVoteId}.voteCount`]: -1,
        },
      }
    );
  } else {
    // new user vote (adds to the voteUsers array)
    const userInfo = {
      user: user,
      votedOptionId: null,
    };
    await poll.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          [`polls.${pollId}.options.voteUsers`]: userInfo,
        },
      }
    );
  }

  // update new user votedOptionId & inc voteCount for selected option
  const updatedPoll = await poll.findOneAndUpdate(
    { _id: new Object(id), [`polls.${pollId}.options.voteUsers.user`]: user },
    {
      $set: {
        [`polls.${pollId}.options.voteUsers.$.votedOptionId`]: new ObjectId(newVotedOptionId),
      },
      $inc: {
        [`polls.${pollId}.options.${newVotedOptionId}.voteCount`]: 1,
      },
    },
    {
      new: true,
      projection: {
        __v: false,
      },
    }
  );
  res.json(updatedPoll);
});

module.exports = router;
