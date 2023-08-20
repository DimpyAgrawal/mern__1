const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('./model/userSchema.js')
require('./db/conn.js');
const userRouter = require('./router/auth.js');
const path = require('path')

dotenv.config({ path: './config.env' });
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// app.use(cors({ credentials: true }));
app.use(cors())

// Middleware
const middleware = (req, res, next) => {
  console.log('Hello from my middleware');
  next();
};

app.use(middleware);

app.use(userRouter);



// Serving the frontent
app.use(express.static(path.join(__dirname, 'client', 'build')))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))

})

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
  
