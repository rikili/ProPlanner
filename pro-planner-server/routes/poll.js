// express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html
// don't return _id references https://stackoverflow.com/questions/22121145/how-to-prevent-mongodb-from-returning-the-object-id-when-finding-a-document
// returning updated document references: https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
// updating object in array references: https://sparkbyexamples.com/mongodb/update-objects-in-the-array-in-mongodb/?expand_article=1 , https://stackoverflow.com/questions/10522347/how-do-you-update-objects-in-a-documents-array-nested-updating
// decrementing in mongodb references: https://stackoverflow.com/questions/26560366/how-to-decrement-like-dec

const express = require('express');
const router = express.Router();
const poll = require('../models/poll');
const {ObjectId} = require('mongodb');

// gets the entire poll document, needs the eventId (id of trip/outing)
router.get('/:eventId', async (req, res) => {
    try {
        const polls = await poll.findOne({eventId: new Object(req.params.eventId)}, {__v: false});
        res.status(200).json(polls);
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});

// adds new poll into the polls
// needs id of the poll document
router.put('/:id', async (req, res) => {
    try {
        const pollId = new ObjectId();
        const addedPoll = await poll.findOneAndUpdate(
            {_id: new ObjectId(req.params.id)},
            {
                $set: {
                    [`polls.${pollId}`]: {
                        question: req.body.question,
                        options: {},
                        votedUsers: [],
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
        if (addedPoll) {
            res.status(200).json(addedPoll);
        } else {
            res.status(404).send("Poll not added")
        }
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});

// adds a new option
// needs id of the poll document and the poll id under polls
router.put('/option/:id/:pollId', async (req, res) => {
    try {
        const optionId = new ObjectId();
        const optionToAdd = {
            option: req.body.option,
            voteCount: 0,
        };


        const addedPoll = await poll.findOneAndUpdate(
            {_id: new ObjectId(req.params.id)},
            {
                $set: {
                    [`polls.${req.params.pollId}.options.${optionId}`]: optionToAdd,
                },
            },
            {
                new: true,
                projection: {
                    __v: false,
                },
            }
        );

        if (addedPoll) {
            res.status(200).json(addedPoll);
        } else {
            res.status(404).send("Option not added");
        }

    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});

// handles when users make a vote (updates the voteCount under options & updates the user's votedOptionId under voteUsers)
// needs id of the poll document, the poll id under polls, user's name (user field), user's existing votedOptionId (null if they didn't vote before), and new option id
router.patch('/vote/:id/:pollId', async (req, res) => {
    try {
        const id = req.params.id;
        const pollId = req.params.pollId;
        const currUser = req.body.user;
        const votedOptionId = req.body.votedOptionId;
        const newVotedOptionId = req.body.newVotedOptionId;

        // decrements prev user vote in options
        if (votedOptionId || votedOptionId !== null) {
            await poll.updateOne(
                {_id: new ObjectId(id)},
                {
                    $inc: {
                        [`polls.${pollId}.options.${votedOptionId}.voteCount`]: -1,
                    },
                }
            );
        } else {
            // new user vote (adds to the voteUsers array)
            const userInfo = {
                user: currUser,
                votedOptionId: null,
            };
            await poll.updateOne(
                {_id: new ObjectId(id)},
                {
                    $push: {
                        [`polls.${pollId}.votedUsers`]: userInfo,
                    },
                }
            );
        }

        // update new user votedOptionId & inc voteCount for selected option
        const updatedPoll = await poll.findOneAndUpdate(
            {_id: new Object(id), [`polls.${pollId}.votedUsers.user`]: currUser},
            {
                $set: {
                    [`polls.${pollId}.votedUsers.$.votedOptionId`]: new ObjectId(newVotedOptionId),
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

        if (updatedPoll) {
            res.status(200).json(updatedPoll);
        } else {
            res.status(404).send("Not voted");
        }

    } catch (error) {
        res.status(500).send(`Unexpected error: ${error}`)
    }
});

module.exports = router;
