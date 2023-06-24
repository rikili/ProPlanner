//  express routing references https://expressjs.com/en/guide/using-middleware.html
// mongoose references https://mongoosejs.com/docs/index.html

const express = require('express');
const router = express.Router();
const user = require('../models/user');

router.post('/', async (req, res) => {
  const userModel = new user({
    name: req.body.name,
  });
  let savedData = await userModel.save();
  res.send(savedData);
});

module.exports = router;
