// code references express documention: https://expressjs.com/en/starter/basic-routing.html
// code references mongoose documention: https://mongoosejs.com/docs/
// mongodb + mongoose + express setup references youtube tutorial: https://www.youtube.com/watch?v=vjf774RKrLc&ab_channel=developedbyed
// empty req.body issue references https://stackoverflow.com/questions/24543847/req-body-empty-on-posts
const mongoose = require('mongoose');
require('dotenv/config');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

//  routes
const trip = require('./routes/trip');
const outing = require('./routes/outing');
const user = require('./routes/user');

//  middleware
app.use('/trip', trip);
app.use('/outing', outing);
app.use('/user', user);

app.listen(5001, () => {
  console.log('server up listening on 5001');
});

// choosing mongoDB database references https://stackoverflow.com/questions/57337218/how-to-connect-to-specific-database-with-mongoose-and-node
mongoose.connect(process.env.mongodb_connect, { dbName: 'ProPlanner' });
