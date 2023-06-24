//  express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const outing = require('../models/outing');

router.get('/', (req, res) => {
  const localTimezoneSelections = req.body.localTimezoneSelections;

  console.log(new Date().toLocaleString());
  res.send('outing');
});

router.get('/:id', async (req, res) => {
  res.json('');
});

router.post('/:id', async (req, res) => {
  const outing = new outing({
    date: req.params.id,
    planParameters: 'testing',
  });
  let savedData = await schedule.save();
});

module.exports = router;
