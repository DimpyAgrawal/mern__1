const mongoose = require('mongoose');
require('dotenv').config();

const DB = "mongodb+srv://abhi:JboTFZriYdznVHd4@cluster0.isarath.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connection successful');
  })
  .catch((err) => {
    console.error('Connection error:', err);
  });
